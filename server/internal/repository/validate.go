package repository

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"pt-server/internal/model"

	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var schemaValidateModels = []any{
	model.Attendance{},
	model.Bookmark{},
	model.BonusLog{},
	model.Comment{},
	model.DictData{},
	model.DictType{},
	model.I18n{},
	model.Invite{},
	model.Medal{},
	model.Message{},
	model.News{},
	model.Offer{},
	model.OfferVote{},
	model.Permission{},
	model.Report{},
	model.RoleModel{},
	model.SiteSetting{},
	model.Snatch{},
	model.Subtitle{},
	model.Thanks{},
	model.Torrent{},
	model.User{},
	model.UserLevel{},
	model.UserMedal{},
}

func ValidateSchema(db *gorm.DB) error {
	var errs []error
	for _, m := range schemaValidateModels {
		if err := validateModel(db, m); err != nil {
			errs = append(errs, err)
		}
	}
	return errors.Join(errs...)
}

func validateModel(db *gorm.DB, modelValue any) error {
	stmt := &gorm.Statement{DB: db}
	if err := stmt.Parse(modelValue); err != nil {
		return fmt.Errorf("parse %T: %w", modelValue, err)
	}

	var errs []error
	if !db.Migrator().HasTable(modelValue) {
		return fmt.Errorf("schema validation failed: table %s is missing for %T", stmt.Schema.Table, modelValue)
	}

	columnTypes, err := db.Migrator().ColumnTypes(modelValue)
	if err != nil {
		return fmt.Errorf("schema validation failed: list columns for %s: %w", stmt.Schema.Table, err)
	}

	actual := make(map[string]gorm.ColumnType, len(columnTypes))
	for _, ct := range columnTypes {
		actual[strings.ToLower(ct.Name())] = ct
	}

	for _, field := range stmt.Schema.Fields {
		if field.DBName == "" {
			continue
		}
		ct, ok := actual[strings.ToLower(field.DBName)]
		if !ok {
			errs = append(errs, fmt.Errorf("schema validation failed: table %s missing column %s for %T", stmt.Schema.Table, field.DBName, modelValue))
			continue
		}

		if field.NotNull {
			if nullable, ok := ct.Nullable(); ok && nullable {
				errs = append(errs, fmt.Errorf("schema validation failed: column %s.%s should be NOT NULL", stmt.Schema.Table, field.DBName))
			}
		}

		if field.PrimaryKey {
			if pk, ok := ct.PrimaryKey(); ok && !pk {
				errs = append(errs, fmt.Errorf("schema validation failed: column %s.%s should be primary key", stmt.Schema.Table, field.DBName))
			}
		}

		if field.AutoIncrement {
			if ai, ok := ct.AutoIncrement(); ok && !ai {
				errs = append(errs, fmt.Errorf("schema validation failed: column %s.%s should be auto increment", stmt.Schema.Table, field.DBName))
			}
		}

		if err := validateColumnType(db, stmt.Schema.Table, field, ct); err != nil {
			errs = append(errs, err)
		}
	}

	return errors.Join(errs...)
}

func validateColumnType(db *gorm.DB, table string, field *schema.Field, ct gorm.ColumnType) error {
	expectedBase, expectedArgs := expectedColumnType(db, field)
	actualBase, actualArgs := normalizeColumnType(ct.DatabaseTypeName())
	actualBase = canonicalDBType(actualBase)
	expectedBase = canonicalDBType(expectedBase)

	if len(actualArgs) == 0 {
		if field.GORMDataType == "string" {
			if l, ok := ct.Length(); ok && l > 0 {
				actualArgs = []string{strconv.FormatInt(l, 10)}
			}
		}
		if field.GORMDataType == "float" {
			if p, s, ok := ct.DecimalSize(); ok {
				actualArgs = []string{strconv.FormatInt(int64(p), 10), strconv.FormatInt(int64(s), 10)}
			}
		}
	}

	if actualBase == "" {
		return fmt.Errorf("schema validation failed: column %s.%s has unknown database type", table, field.DBName)
	}
	if expectedBase == "" {
		return nil
	}

	if actualBase != expectedBase {
		return fmt.Errorf(
			"schema validation failed: column %s.%s type mismatch, expected %s got %s",
			table, field.DBName, expectedBase, actualBase,
		)
	}

	if len(expectedArgs) > 0 {
		if len(actualArgs) != len(expectedArgs) {
			if !(len(actualArgs) == 0 && allowOmittedTypeArgs(db, field, actualBase)) {
				return fmt.Errorf(
					"schema validation failed: column %s.%s type parameters mismatch, expected %v got %v",
					table, field.DBName, expectedArgs, actualArgs,
				)
			}
		} else {
			for i := range expectedArgs {
				if expectedArgs[i] != actualArgs[i] {
					if !(len(actualArgs) == 0 && allowOmittedTypeArgs(db, field, actualBase)) {
						return fmt.Errorf(
							"schema validation failed: column %s.%s type parameters mismatch, expected %v got %v",
							table, field.DBName, expectedArgs, actualArgs,
						)
					}
					break
				}
			}
		}
	}

	return nil
}

func expectedColumnType(db *gorm.DB, field *schema.Field) (string, []string) {
	switch field.GORMDataType {
	case "string":
		if db.Dialector.Name() == "postgres" {
			if field.Size > 0 {
				return "varchar", []string{strconv.FormatInt(int64(field.Size), 10)}
			}
			return "text", nil
		}
		if field.Size > 0 && field.Size <= 255 {
			return "varchar", []string{strconv.FormatInt(int64(field.Size), 10)}
		}
		return "text", nil
	case "bool":
		if db.Dialector.Name() == "postgres" {
			return "boolean", nil
		}
		return "numeric", nil
	case "int", "uint":
		if field.AutoIncrement || field.PrimaryKey {
			if db.Dialector.Name() == "postgres" {
				return "bigint", nil
			}
			return "integer", nil
		}
		if db.Dialector.Name() == "postgres" {
			return "bigint", nil
		}
		return "integer", nil
	case "float":
		if field.Precision > 0 {
			return "numeric", []string{
				strconv.FormatInt(int64(field.Precision), 10),
				strconv.FormatInt(int64(field.Scale), 10),
			}
		}
		return "numeric", nil
	case "time":
		if db.Dialector.Name() == "postgres" {
			return "timestamp", nil
		}
		return "datetime", nil
	case "bytes":
		if db.Dialector.Name() == "postgres" {
			return "bytea", nil
		}
		return "blob", nil
	default:
		if field.DataType != "" {
			return strings.ToLower(string(field.DataType)), nil
		}
		return strings.ToLower(string(field.GORMDataType)), nil
	}
}

func normalizeColumnType(raw string) (string, []string) {
	s := strings.ToLower(strings.TrimSpace(raw))
	if s == "" {
		return "", nil
	}
	s = strings.ReplaceAll(s, " ", "")
	idx := strings.Index(s, "(")
	if idx < 0 {
		return s, nil
	}
	base := s[:idx]
	argStr := strings.TrimSuffix(s[idx+1:], ")")
	if argStr == "" {
		return base, nil
	}
	parts := strings.Split(argStr, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		out = append(out, strings.TrimSpace(p))
	}
	return base, out
}

func canonicalDBType(t string) string {
	switch strings.ToLower(strings.ReplaceAll(strings.TrimSpace(t), " ", "")) {
	case "int8", "bigint", "bigserial":
		return "bigint"
	case "int4", "integer", "serial":
		return "integer"
	case "int2", "smallint", "smallserial":
		return "smallint"
	case "bool", "boolean":
		return "boolean"
	case "varchar", "charactervarying":
		return "varchar"
	case "text":
		return "text"
	case "timestamp", "timestampwithouttimezone", "timestampwithtimezone", "timestamptz":
		return "timestamp"
	case "numeric", "decimal":
		return "numeric"
	case "float4", "real":
		return "real"
	case "float8", "doubleprecision":
		return "doubleprecision"
	case "bytea", "blob":
		return "bytea"
	case "datetime":
		return "datetime"
	default:
		return strings.ToLower(strings.ReplaceAll(strings.TrimSpace(t), " ", ""))
	}
}

func allowOmittedTypeArgs(db *gorm.DB, field *schema.Field, actualBase string) bool {
	if db.Dialector.Name() == "sqlite" {
		return actualBase == "text" || actualBase == "numeric" || actualBase == "integer" || actualBase == "datetime"
	}
	return field.GORMDataType == "string" && actualBase == "text"
}

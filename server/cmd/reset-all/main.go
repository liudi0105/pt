package main

import (
	"flag"
	"log"
	"os"
	"path/filepath"
	"strings"

	"pt-server/internal/config"
	"pt-server/internal/repository"
	"pt-server/internal/seed"
)

func main() {
	seedDir := flag.String("seed", "seed", "seed data directory")
	ddlPath := flag.String("ddl", "ddl.sql", "path to DDL file")
	flag.Parse()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := repository.NewDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Dropping all tables...")
	tables, err := db.Migrator().GetTables()
	if err != nil {
		log.Fatalf("Failed to get tables: %v", err)
	}

	if cfg.Driver == "postgres" || cfg.Driver == "postgresql" {
		db.Exec("SET session_replication_role = 'replica'")
	} else {
		db.Exec("PRAGMA foreign_keys = OFF")
	}

	for _, t := range tables {
		if err := db.Migrator().DropTable(t); err != nil {
			log.Printf("Warning: failed to drop table %s: %v", t, err)
		} else {
			log.Printf("  Dropped table: %s", t)
		}
	}

	if cfg.Driver == "postgres" || cfg.Driver == "postgresql" {
		db.Exec("SET session_replication_role = 'origin'")
	} else {
		db.Exec("PRAGMA foreign_keys = ON")
	}

	log.Println("Creating tables from ddl.sql...")
	ddlBytes, err := os.ReadFile(*ddlPath)
	if err != nil {
		log.Fatalf("Failed to read ddl.sql: %v", err)
	}

	statements := strings.Split(string(ddlBytes), ";")
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		if err := db.Exec(stmt).Error; err != nil {
			log.Fatalf("Failed to execute DDL statement: %v\nSQL: %s", err, stmt)
		}
	}
	log.Println("Tables created successfully")

	log.Println("Seeding system data...")
	sysEntries, err := seed.ReadFiles(filepath.Join(*seedDir, "system"))
	if err != nil {
		log.Fatalf("Failed to read system seed files: %v", err)
	}
	if err := seed.InsertAll(db, sysEntries); err != nil {
		log.Fatalf("Failed to insert system seed data: %v", err)
	}

	log.Println("Seeding demo data...")
	demoEntries, err := seed.ReadFiles(filepath.Join(*seedDir, "demo"))
	if err != nil {
		log.Fatalf("Failed to read demo seed files: %v", err)
	}
	if err := seed.InsertAll(db, demoEntries); err != nil {
		log.Fatalf("Failed to insert demo seed data: %v", err)
	}

	log.Println("Database reset and all data seeded successfully")
}

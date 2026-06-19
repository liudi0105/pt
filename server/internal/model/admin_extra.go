package model

type AdminDashboardStats struct {
	TotalUsers         int64     `json:"total_users"`
	ActiveUsers        int64     `json:"active_users"`
	TotalUploadBytes   int64     `json:"total_upload_bytes"`
	TotalDownloadBytes int64     `json:"total_download_bytes"`
	LatestUsers        []User    `json:"latest_users"`
	LatestTorrents     []Torrent `json:"latest_torrents"`
}

type AdminRiskRule struct {
	Key      string `json:"key"`
	Rule     string `json:"rule"`
	Scope    string `json:"scope"`
	Endpoint string `json:"endpoint"`
	Priority string `json:"priority"`
	Outcome  string `json:"outcome"`
	Notes    string `json:"notes"`
}

type AdminRiskResponse struct {
	AllowRules    []AdminRiskRule `json:"allow_rules"`
	DenyRules     []AdminRiskRule `json:"deny_rules"`
	CheckEndpoint string          `json:"check_endpoint"`
}

type AdminResourceItem struct {
	Key        string `json:"key"`
	Resource   string `json:"resource"`
	Page       string `json:"page"`
	API        string `json:"api"`
	Consumers  string `json:"consumers"`
	StateModel string `json:"state_model"`
	Status     string `json:"status"`
}

type AdminResourcesResponse struct {
	Resources []AdminResourceItem `json:"resources"`
}

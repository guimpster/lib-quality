export interface GitHubBase {
}

export interface Label {
  id: number
  name: string
}

export interface Issue extends GitHubBase {
  id: number
  number: number
  created_at: Date
  closed_at: Date
  state: string
  labels: Label[]
}

export interface ConsolidatedData {
  id: string
  org:  string
  repo: string
  qty_issues: number
  avg_age: number
  std_age: number
  qty_stars: number
  qty_forks: number
  qty_contributors: number
  issues_by_labels: object
}
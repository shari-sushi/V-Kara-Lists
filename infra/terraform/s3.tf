# -------------------------------------------------------------------
# S3: API env ファイル
# -------------------------------------------------------------------
resource "aws_s3_bucket" "api_env" {
  bucket = var.s3_api_env_bucket
}

resource "aws_s3_bucket_public_access_block" "api_env" {
  bucket = aws_s3_bucket.api_env.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -------------------------------------------------------------------
# S3: App env ファイル
# -------------------------------------------------------------------
resource "aws_s3_bucket" "app_env" {
  bucket = var.s3_app_env_bucket
}

resource "aws_s3_bucket_public_access_block" "app_env" {
  bucket = aws_s3_bucket.app_env.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -------------------------------------------------------------------
# S3: Caddy env ファイル
# -------------------------------------------------------------------
resource "aws_s3_bucket" "caddy_env" {
  bucket = var.s3_caddy_env_bucket
}

resource "aws_s3_bucket_public_access_block" "caddy_env" {
  bucket = aws_s3_bucket.caddy_env.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -------------------------------------------------------------------
# S3: DB バックアップ
# -------------------------------------------------------------------
resource "aws_s3_bucket" "db_backup" {
  bucket = "v-kara-db-backup"
}

resource "aws_s3_bucket_public_access_block" "db_backup" {
  bucket = aws_s3_bucket.db_backup.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -------------------------------------------------------------------
# DB Subnet Group（VPC のデフォルトサブネットグループ）
# -------------------------------------------------------------------
resource "aws_db_subnet_group" "main" {
  name        = "default-vpc-0005126ae8d07b034"
  description = "Created from the RDS Management Console"

  subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_c.id,
    aws_subnet.private_a.id,
    aws_subnet.private_c.id,
  ]
}

# -------------------------------------------------------------------
# RDS Instance
# -------------------------------------------------------------------
resource "aws_db_instance" "main" {
  identifier        = "v-kara-db"
  instance_class    = "db.t3.micro"
  engine            = "mysql"
  engine_version    = "8.4.7"
  allocated_storage = 20

  username = "sharin"
  password = "dummy" # import 後は ignore_changes で管理外にする

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  availability_zone   = "ap-northeast-1a"
  multi_az            = false
  publicly_accessible = false

  storage_encrypted = true
  kms_key_id        = var.rds_kms_key_id

  max_allocated_storage = 1000
  copy_tags_to_snapshot = true

  skip_final_snapshot       = false
  final_snapshot_identifier = "v-kara-db-final-snapshot"

  lifecycle {
    ignore_changes = [password]
  }
}

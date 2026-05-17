# -------------------------------------------------------------------
# IAM Managed Policy: S3 env ファイルへの読み取り権限
# -------------------------------------------------------------------
resource "aws_iam_policy" "policy_get_s3" {
  name = "policy_get_s3"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = [
          "${aws_s3_bucket.api_env.arn}/.env",
          "${aws_s3_bucket.app_env.arn}/.env",
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = "${aws_s3_bucket.db_backup.arn}/*"
      }
    ]
  })
}

# -------------------------------------------------------------------
# IAM Role: EC2 が S3 env ファイルを取得するためのロール
# -------------------------------------------------------------------
resource "aws_iam_role" "ec2" {
  name        = "role_ec2_get_s3"
  description = "Allows EC2 instances to call AWS services on your behalf."

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ec2.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_s3" {
  role       = aws_iam_role.ec2.name
  policy_arn = aws_iam_policy.policy_get_s3.arn
}

resource "aws_iam_role_policy_attachment" "ec2_ecr" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "role_ec2_get_s3"
  role = aws_iam_role.ec2.name
}

# -------------------------------------------------------------------
# EC2 Instance
# -------------------------------------------------------------------
resource "aws_instance" "app" {
  ami                    = "ami-054400ced365b82a0"
  instance_type          = "t3a.micro"
  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = "key-for-vkara-instance"
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  # セキュリティパッチの自動適用（Amazon Linux 2023）
  user_data = <<-EOF
    #!/bin/bash
    dnf install -y dnf-automatic
    sed -i 's/apply_updates = no/apply_updates = yes/' /etc/dnf/automatic.conf
    systemctl enable --now dnf-automatic.timer
  EOF

  lifecycle {
    ignore_changes = [user_data]
  }

  tags = { Name = "v-kara-public" }
}

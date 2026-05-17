# -------------------------------------------------------------------
# VPC
# -------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block = "10.1.0.0/22"

  tags = { Name = "v-kara-vpc" }
}

# -------------------------------------------------------------------
# Subnets
# -------------------------------------------------------------------
resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.1.0.0/26"
  availability_zone = "ap-northeast-1a"

  tags = { Name = "v-kara-subnet-public1-ap-northeast-1a" }
}

resource "aws_subnet" "public_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.1.0.64/26"
  availability_zone = "ap-northeast-1c"

  tags = { Name = "v-kara-subnet-public2-ap-northeast-1c" }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.1.2.0/26"
  availability_zone = "ap-northeast-1a"

  tags = { Name = "v-kara-subnet-private1-ap-northeast-1a" }
}

resource "aws_subnet" "private_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.1.2.64/26"
  availability_zone = "ap-northeast-1c"

  tags = { Name = "v-kara-subnet-private2-ap-northeast-1c" }
}

# 用途: API 用プライベートサブネット（メインルートテーブル使用）
resource "aws_subnet" "misc_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.1.1.0/24"
  availability_zone = "ap-northeast-1c"

  tags = { Name = "v-kara-subnet-private03-forapi01" }
}

resource "aws_subnet" "misc_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.1.3.0/24"
  availability_zone = "ap-northeast-1a"

  tags = { Name = "v-kara-subnet-private04-forapi02" }
}

# -------------------------------------------------------------------
# Internet Gateway
# -------------------------------------------------------------------
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "v-kara-igw" }
}

# -------------------------------------------------------------------
# Route Tables
# -------------------------------------------------------------------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "v-kara-rtb-public" }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_c" {
  subnet_id      = aws_subnet.public_c.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private_a" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "v-kara-rtb-private1-ap-northeast-1a" }
}

resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private_a.id
}

resource "aws_route_table" "private_c" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "v-kara-rtb-private2-ap-northeast-1c" }
}

resource "aws_route_table_association" "private_c" {
  subnet_id      = aws_subnet.private_c.id
  route_table_id = aws_route_table.private_c.id
}

# メインルートテーブル（misc サブネット用 / Name タグなし）
resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id
}

# -------------------------------------------------------------------
# S3 VPC Endpoint（Gateway 型）
# EC2 → S3 の通信がインターネットを経由しないようにする
# -------------------------------------------------------------------
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.ap-northeast-1.s3"
  vpc_endpoint_type = "Gateway"

  route_table_ids = [
    aws_route_table.private_a.id,
    aws_route_table.private_c.id,
  ]

  tags = { Name = "v-kara-vpce-s3" }
}

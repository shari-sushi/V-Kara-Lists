#!/bin/bash
# 既存 AWS リソースを Terraform 管理下に取り込むスクリプト
# 前提: terraform init を済ませておくこと
# 実行: bash import.sh

set -e

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="ap-northeast-1"

echo "=== VPC ==="
terraform import aws_vpc.main vpc-0005126ae8d07b034

echo "=== Subnets ==="
terraform import aws_subnet.public_a  subnet-0f52fae649df401ca
terraform import aws_subnet.public_c  subnet-0d541235c3a022d8c
terraform import aws_subnet.private_a subnet-0924866282ca714ee
terraform import aws_subnet.private_c subnet-039841cab905f7204
terraform import aws_subnet.misc_c    subnet-07a7a223e74f02ac5
terraform import aws_subnet.misc_a    subnet-0fdc3d153f03c9de0

echo "=== Internet Gateway ==="
terraform import aws_internet_gateway.main igw-0ee73f834f622c64f

echo "=== Route Tables ==="
terraform import aws_route_table.public    rtb-0870f922637a308e1
terraform import aws_route_table.private_a rtb-00ed99c81ef53964d
terraform import aws_route_table.private_c rtb-0e7375448e34d3c96
terraform import aws_route_table.main      rtb-045e0ffd98719a1ae

echo "=== Route Table Associations ==="
terraform import aws_route_table_association.public_a  subnet-0f52fae649df401ca/rtb-0870f922637a308e1
terraform import aws_route_table_association.public_c  subnet-0d541235c3a022d8c/rtb-0870f922637a308e1
terraform import aws_route_table_association.private_a subnet-0924866282ca714ee/rtb-00ed99c81ef53964d
terraform import aws_route_table_association.private_c subnet-039841cab905f7204/rtb-0e7375448e34d3c96

echo "=== VPC Endpoint ==="
terraform import aws_vpc_endpoint.s3 vpce-06909972ad17e78a6

echo "=== Security Groups ==="
terraform import aws_security_group.alb sg-01ec8fe8a9d0d7e1e
terraform import aws_security_group.ec2 sg-0f1e03844c853a15d
terraform import aws_security_group.rds sg-01387505ed9b33a35

echo "=== ALB ==="
terraform import aws_lb.main \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:loadbalancer/app/v-kara-ec2-unified-alb/fa6282adb841326c

# NOTE: aws_lb_target_group_attachment は terraform import 非対応
# plan で "will be created" と表示されるが、apply 時は既存登録があっても冪等（エラーなし）

echo "=== Target Groups ==="
terraform import aws_lb_target_group.app \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:targetgroup/v-kara-ec2-app-tg/209d9185e8c9f5cc
terraform import aws_lb_target_group.api \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:targetgroup/vkara-api-ec2-tg/b8969723a779f9cc
terraform import aws_lb_target_group.app_to_http \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:targetgroup/vkara-ec2-app-toHttp-tg/d8f9e4d95785deb8

echo "=== ALB Listeners ==="
terraform import aws_lb_listener.http \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:listener/app/v-kara-ec2-unified-alb/fa6282adb841326c/1a7dac186fc24100
terraform import aws_lb_listener.https \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:listener/app/v-kara-ec2-unified-alb/fa6282adb841326c/ed204d5f2fb4ecc5

echo "=== Listener Rules ==="
terraform import aws_lb_listener_rule.backend \
  arn:aws:elasticloadbalancing:${REGION}:${ACCOUNT_ID}:listener-rule/app/v-kara-ec2-unified-alb/fa6282adb841326c/ed204d5f2fb4ecc5/f46734cb07db3715

echo "=== IAM ==="
terraform import aws_iam_policy.policy_get_s3        arn:aws:iam::${ACCOUNT_ID}:policy/policy_get_s3
terraform import aws_iam_role.ec2                    role_ec2_get_s3
terraform import aws_iam_role_policy_attachment.ec2_s3 role_ec2_get_s3/arn:aws:iam::${ACCOUNT_ID}:policy/policy_get_s3
terraform import aws_iam_instance_profile.ec2        role_ec2_get_s3

echo "=== EC2 ==="
terraform import aws_instance.app i-0f1a06523ac1ee51a

echo "=== RDS ==="
terraform import aws_db_subnet_group.main default-vpc-0005126ae8d07b034
terraform import aws_db_instance.main     v-kara-db

echo "=== S3 ==="
terraform import aws_s3_bucket.api_env                      v-kara-api-envfile
terraform import aws_s3_bucket.app_env                      v-kara-app-envfile
terraform import aws_s3_bucket_public_access_block.api_env  v-kara-api-envfile
terraform import aws_s3_bucket_public_access_block.app_env  v-kara-app-envfile

echo "=== ACM ==="
terraform import aws_acm_certificate.main \
  arn:aws:acm:${REGION}:${ACCOUNT_ID}:certificate/86cc13a6-e4af-4e1b-bc6f-2b8812e55771

echo ""
echo "=== import 完了 ==="
echo "次のステップ: terraform plan を実行して差分を確認"
echo "差分がある場合は .tf ファイルを実際の設定に合わせて修正する"

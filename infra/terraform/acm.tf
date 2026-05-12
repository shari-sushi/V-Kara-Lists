# -------------------------------------------------------------------
# ACM Certificate（既存、Cloudflare DNS で検証済み）
# import のみ。Terraform では管理するが再作成はしない。
# -------------------------------------------------------------------
resource "aws_acm_certificate" "main" {
  domain_name               = "v-karaoke.com"
  subject_alternative_names = ["*.v-karaoke.com"]
  validation_method         = "DNS"

  lifecycle {
    prevent_destroy = true
  }
}

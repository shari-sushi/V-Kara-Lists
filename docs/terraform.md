# Terraform 備忘録

## 基本構文

```hcl
resource "aws_instance" "app" {
#         ↑ AWS側が決めた種別   ↑ 自分がつける参照名（ファイル内で使う）
  ami           = "ami-xxxxxxxx"
  instance_type = "t3a.micro"
}
```

AWSコンソールの `name =` とTerraform内の参照名は別物（たまたま同じ文字列にしているだけ）。

## リソース間の参照

```hcl
target_id = aws_instance.app.id
#           リソース種別.参照名.属性
```

コンソールで「インスタンスIDをコピペ」していた作業をコードで表現したもの。
Terraformはこの参照をたどって作成順序を自動解決する。

## terraform plan の見方

| 記号 | 意味 |
| --- | --- |
| `~` | 変更 |
| `-/+` | 破壊して再作成（要注意） |

`# forces replacement` とコメントされている属性が再作成の原因。
EC2の `associate_public_ip_address` など起動時にしか設定できない属性が該当する。

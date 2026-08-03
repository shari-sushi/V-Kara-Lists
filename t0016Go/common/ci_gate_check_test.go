package common

import "testing"

// このテストは branch protection の required status checks が
// 実際にマージをブロックするかを検証するために意図的に失敗させている。
// 検証後にこのファイルごと削除する。
func TestCIGateCheckIntentionalFailure(t *testing.T) {
	t.Fatal("intentional failure for CI gate verification (see PR description)")
}

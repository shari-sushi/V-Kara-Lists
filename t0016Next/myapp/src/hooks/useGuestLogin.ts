import { useRouter } from "next/router"
import { domain } from "@/../env"

export const useGuestLogin = () => {
  const router = useRouter()

  const guestLogin = async () => {
    try {
      const response = await fetch(`${domain.backendHost}/users/guestlogin`, {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.status != 200) {
        throw new Error(response.statusText)
      }
      router.replace(router.asPath)
    } catch (error) {
      console.error(error)
      alert("ゲストログインに失敗しました")
    }
  }

  return { guestLogin }
}

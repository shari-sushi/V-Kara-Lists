export const domain = process.env.NODE_ENV === 'development' ? {
  // VSCode上
  backendHost: 'http://localhost:8080/v1'
} : {
  // クラウド環境
  backendHost: 'https://backend.v-karaoke.com/v1'
  // backendHost: 'http://localhost:8080/v1'
}
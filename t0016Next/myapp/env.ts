export const domain = process.env.NODE_ENV === 'development' ? {
  backendHost: 'http://localhost:8080/v1'
} : {
  backendHost: 'http://backend.v-karaoke.com/v1'
}
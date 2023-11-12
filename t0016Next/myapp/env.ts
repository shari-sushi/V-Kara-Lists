export const domain = process.env.NODE_ENV === 'development' ? {
    backendHost: 'http://localhost:8080'
  } : {
    backendHost: 'http://localhost:8080' //ドメイン取得したら記入
  }
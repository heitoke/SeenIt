export default defineEventHandler((event) => {
  const userId = event.context.userId
  
  asyncLocalStorage.run({ userId }, () => {
    // Контекст доступен внутри
  })
})
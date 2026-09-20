// Unified Sovereign Firebase re-export from root src/firebase.ts
export * from '../../src/firebase';


// Connection test - removed to avoid misleading console errors in sandboxed environment
/*
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();
*/

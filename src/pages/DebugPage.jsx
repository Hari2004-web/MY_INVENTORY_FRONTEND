// import { useAuth } from "../context/AuthContext";

// const DebugPage = () => {
//   const { user } = useAuth();

//   return (
//     <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '16px', color: '#000', backgroundColor: '#fff' }}>
//       <h1>Authentication Debug Page</h1>
//       <p>If you can see this page, you are successfully logged in.</p>
//       <hr style={{ margin: '20px 0' }} />
//       <h2>User Object from AuthContext:</h2>
//       <pre
//         style={{
//           backgroundColor: '#f0f0f0',
//           padding: '15px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           whiteSpace: 'pre-wrap',
//           wordWrap: 'break-word',
//         }}
//       >
//         {JSON.stringify(user, null, 2)}
//       </pre>
//     </div>
//   );
// };

// export default DebugPage;
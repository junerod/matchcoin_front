// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import axios from 'axios';

// const RECEIVER_ADDRESS = "0xA62695711A8A1D4B19d1d0fBA4E5eb50f9f5808e"; // Sua carteira que recebe os BNB

// const App = () => {

//   const queryParams = new URLSearchParams(window.location.search);
//   const transacao = queryParams.get("transacao");
  
//   const [account, setAccount] = useState<string | null>(null);
//   const [bnbAmount, setBnbAmount] = useState<string | null>(null);
//   const [tokenAmount, setTokenAmount] = useState<string>("");
//   const [clienteId, setClienteId] = useState<string>("");

//   const [data, setData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     console.log("transacao", transacao);
//     axios.get('http://localhost:4200/dados')
//       .then((response) => {
//         setData(response.data);
//         setTokenAmount(response.data.valor)
//         setClienteId(response.data.cliente_id)
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error('Erro ao buscar dados:', err);
//         setError('Erro ao buscar dados');
//         setIsLoading(false);
//       });
//   }, [transacao])

//   // Conectar à MetaMask
//   const connectWallet = async () => {
//     console.log("connectWallet", window.ethereum);
//     if (window.ethereum) {
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         const userAddress = await signer.getAddress();
//         setAccount(userAddress);
//         calculateGas(provider, tokenAmount);
//       } catch (error) {
//         console.error("Erro ao conectar à MetaMask:", error);
//       }
//     } else {
//       alert("MetaMask não detectada! Instale no seu navegador.");
//     }
//   };

//   // Calcular o valor do gás (dobro do custo da transação)
//   const calculateGas = async (provider: ethers.BrowserProvider, transferAmount: string) => {
//     try {
//       const gasPrice = await provider.getFeeData();
//       const estimatedGas = ethers.parseUnits(transferAmount, "ether");
//       const requiredGas = estimatedGas * BigInt(2);

//       setBnbAmount(ethers.formatEther(requiredGas));
//     } catch (error) {
//       console.error("Erro ao calcular o gás:", error);
//     }
//   };

//   // Enviar BNB para pagar a taxa
//   const sendBNB = async () => {
//     if (!account || !bnbAmount) {
//       alert("Conecte sua carteira e aguarde o cálculo da taxa.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       const tx = await signer.sendTransaction({
//         to: RECEIVER_ADDRESS,
//         value: ethers.parseEther(bnbAmount),
//       });

//       await tx.wait();
//       updateTax(tx.hash);
//       console.log(`Taxa enviada com sucesso! TX: ${tx.hash}`);
//       alert(`Taxa enviada com sucesso! TX: ${tx.hash}`);

//     } catch (error) {
//       console.error("Erro ao enviar BNB:", error);
//       alert("Falha na transação.");
//     }
//     setIsLoading(false);
//   };

//   const updateTax = async (hash:string) => {
    
//     const payload = {
//       hash: hash,
//       cliente_id: clienteId.toString(),
//       valor: tokenAmount
//     };
    
//     console.log(payload);

//     axios.post('http://localhost:4000/api/transacoes/receber-taxa', payload)
//       .then(response => {
//         console.log('Resposta:', response.data);
//       })
//       .catch(error => {
//         console.error('Erro na requisição:', error);
//       });
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Pagamento de Taxa de Transferência</h1>

//       <div style={{ padding: '20px 0px', background: "lightgray" }}>
//         <h1>Valores a receber</h1>
//         {isLoading ? (
//           <p>Carregando...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : (
//           <p>Valor: {tokenAmount}</p>
//         )}
//     </div>


//       {!account ? (
//         <button
//           onClick={connectWallet}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
//         >
//           Conectar MetaMask
//         </button>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow-md text-center">
//           <p className="text-gray-700 mb-2">Carteira Conectada:</p>
//           <p className="font-mono text-sm text-gray-900 mb-4">{account}</p>

//           <p className="text-lg font-semibold text-gray-800">
//             {/* Valor do Gás Estimado (x2): {bnbAmount} BNB */}
//             Valor do Gás Estimado: {bnbAmount} BNB
//           </p>

//           <button
//             onClick={sendBNB}
//             disabled={isLoading}
//             className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
//           >
//             {isLoading ? "Processando..." : "Pagar Taxa"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Saque from "./pages/Saque";
import Deposito from './pages/Deposito';

const Home: React.FC = () => {
    return (
        <Container fluid>
            <Row>
                <Col xs={12} md={3} lg={2} className="bg-light vh-100 p-3">
                    <h4>Meu Projeto</h4>
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/deposito">Depósito</Nav.Link>
                        <Nav.Link href="/saque">Saque</Nav.Link>
                    </Nav>
                </Col>
        
                <Col xs={12} md={9} lg={10} className="p-4">
                    <h1>Página Inicial</h1>
                    <p>
                        Bem-vindo ao meu projeto! Aqui você encontrará informações sobre os serviços oferecidos, 
                        nossa equipe e muito mais.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

const NotFound: React.FC = () => {
    return (
        <div>
            <h1>Página não encontrada</h1>
            <p>A rota que você acessou não existe.</p>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/saque" element={<Saque />} />
                <Route path="/deposito" element={<Deposito />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;

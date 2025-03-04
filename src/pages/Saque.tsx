import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from 'axios';
import { Container, Form, Button, Spinner } from 'react-bootstrap';

const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS || "0xA62695711A8A1D4B19d1d0fBA4E5eb50f9f5808e"; // Sua carteira que recebe os BNB
const CLIENTE_URL = process.env.CLIENTE_URL || "http://localhost:4300/cliente";
const CALCULAR_GAS_URL = process.env.CALCULAR_GAS_URL || "http://localhost:4300/calcular-gas";
const RECEBER_TAXA_URL = process.env.RECEBER_TAXA_URL || "http://localhost:4300/receber-taxa";
const SACAR_URL = process.env.SACAR_URL || "http://localhost:4300/sacar";
const IDENTIFICADOR_URL = process.env.IDENTIFICADOR_URL || "http://localhost:4000/api/transacoes/identificador"; 

interface CalcularGasDTO {
    carteira: string;
    quantidade: string;
}

interface ReceberTaxaDTO {
    identificador: string;
    cpf: string;
    quantidade: string;
    hash: string;
    carteira: string;
    gas_bnb: string;
}

interface SacarDTO {
    identificador: string;
    cpf: string;
    quantidade: string;
    carteira: string;
}

const Saque = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [quantidade, setQuantidade] = useState<number>(0);
    const [carteira, setCarteira] = useState('');
    const [saque, setSaque] = useState<number>(0);
    const [totalGas, setTotalGas] = useState<string>("");
    const [unidadeGasEstimado, setUnidadeGasEstimado] = useState<string>("");
    const [identificador, setIdentificador] = useState('');
    const [sacar, setSacar] = useState<boolean>(false);

    useEffect(() => {
        const buscarIdentificador = async () => {
            try {
                const response = await axios.get(IDENTIFICADOR_URL);
                setIdentificador(response.data.identificador);
            } catch (err) {
                alert("Erro ao buscar identificador. Por favor, recarrege a página novamente!");
                console.error(err);
            }
        };
    
        const buscarCliente = async () => {
            try {
                const response = await axios.get(CLIENTE_URL);
                setNome(response.data.nome);
                setCpf(response.data.cpf);
                setQuantidade(response.data.quantidade)
            } catch (err) {
                alert("Erro ao buscar cliente. Por favor, recarrege a página novamente!");
                console.error(err);
            }
        };
        buscarIdentificador();
        buscarCliente();
        setIsLoading(false);
    }, []);

    const handleConectarCarteira = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }],
                });
                
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length == 1) {
                    let _carteira = accounts.shift();
                    setCarteira(_carteira);
                } else {
                    console.warn("implementar lógica para quanto habilitar 2 carteira");    
                }
            } catch (error) {
                console.error('Erro ao solicitar permissões:', error);
                alert('Erro ao solicitar permissões.');
            }
        } else {
            alert('MetaMask não encontrada. Por favor, instale a extensão.');
        }
    }

    const verificarSaque = (_saque:number) => {
        if (_saque > quantidade) {
            setSaque(quantidade);
        } else {
            setSaque(_saque);
        }
    }

    const handleCalulcarGas = async () => {
        if (window.ethereum) {
            try {
                setIsLoading(true);
                const rs = await calcularGas();
                if (!rs) {
                    alert("Falha durante o processo de calcular taxas de transação. Por favor recarrege a página novamente.")
                }
            } catch (error) {
                console.error("Erro ao conectar à MetaMask:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
          alert("MetaMask não detectada! Instale no seu navegador.");
        }
    };
    
    const handleVoltarHome = () => {
        window.location.href = '/';
    };

    const calcularGas = async () => {
        const payload: CalcularGasDTO = {
            carteira: carteira,
            quantidade: saque.toString()  
        };
  
        try {
            const response = await axios.post(CALCULAR_GAS_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
  
            setTotalGas(response.data.custoTotalBnb);
            setUnidadeGasEstimado(response.data.unidadeGasEstimado);
            setSacar(true);
            return true;
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            return false;
        }
    };

    const handleSacar = async () => {
        if (!carteira || !totalGas) {
            alert("Conecte sua carteira e aguarde o cálculo da taxa.");
            return;
        }
      
        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
      
            const tx = await signer.sendTransaction({
                to: RECEIVER_ADDRESS,
                value: ethers.parseEther(totalGas),
            });
      
            await tx.wait();
            const hash = tx.hash;
            // console.log("hash", hash);

            const rs = await updateTax(hash);
            if (!rs) {
                alert("Falha durante o processo salvar a transação. Por favor entre em contato com o administrador.")
            }

            const _rs = await efetuarSaque();
            if (_rs) {
                alert(`Operação realizada com sucesso!`);
            } else {
                alert("Falha durante o processo salvar a transação. Por favor entre em contato com o administrador.")
            }
        } catch (error) {
            console.error("Erro ao enviar BNB:", error);
            alert("Falha na transação.");
        } finally {
            setIsLoading(false);
        }
    }

    const updateTax = async (hash:string) => {
        const payload:ReceberTaxaDTO = {
            identificador: identificador,
            hash: hash,
            cpf: cpf,
            quantidade: saque.toString(),
            carteira: carteira,
            gas_bnb: totalGas
        };
          
        try {
            const response = await axios.post(RECEBER_TAXA_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return true;
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            return false;
        }
    }

    const efetuarSaque = async () => {
        const payload:SacarDTO = {
            identificador: identificador,
            cpf: cpf,
            quantidade: saque.toString(),
            carteira: carteira
        };

        try {
            const response = await axios.post(SACAR_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return true;
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            return false;
        }
    }

    return (  
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            {(carteira != "") && (
                <div className="container mt-4" style={{ width: '500px' }}>
                    <h2 className="mb-3">Formulário de Saque</h2>

                    {(isLoading) && (
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',}}>
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Processando...</span>
                            </Spinner>
                            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                                Processando...
                            </span>
                        </div>
                    )}

                    <form className="border p-4 rounded bg-light">
                        <div className="mb-3">
                            <label className="form-label"><strong>CPF do Usuário:</strong> {cpf}</label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><strong>Nome do Usuário:</strong> {nome}</label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><strong>Quantidade total de token para saque:</strong> {quantidade}</label>
                        </div>
                
                        <hr />

                        {(sacar) && (
                            <>
                                <h3>Taxas de transação</h3>

                                <div className="mb-3">
                                    <label className="form-label"><strong>Gas Estimado:</strong> {unidadeGasEstimado}</label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><strong>Custo Total:</strong> {totalGas} BNB</label>
                                </div>    
                            </>
                        )}
                        
                        <div className="mb-3">
                            <label htmlFor="saque" className="form-label"><strong>Digite a quantidade que deseja sacar:</strong></label>
                            <input
                                type="number"
                                className="form-control"
                                id="saque"
                                value={saque}
                                onChange={(e) => verificarSaque(parseInt(e.target.value) || 0)}
                                min="0"
                                required
                                disabled={sacar}
                            />
                        </div>
                
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={handleVoltarHome} disabled={isLoading}>
                                Home
                            </Button>
                            <Button variant="primary" onClick={handleCalulcarGas} disabled={isLoading} hidden={sacar}>
                                Sacar
                            </Button>
                            <Button variant="primary" onClick={handleSacar} disabled={isLoading} hidden={!sacar}>
                                Sacar 
                            </Button>
                        </div>
                    </form>
                </div>
            )}  
            
            {(carteira == "") && (
                <Button onClick={handleConectarCarteira} style={{ marginRight: "0.5rem" }}>
                    Conectar Carteira
                </Button>
            )}  
        </Container>
    );
};

export default Saque;
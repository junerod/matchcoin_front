import React, { useRef, useEffect, useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';
import axios from 'axios';

const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS || "0xA62695711A8A1D4B19d1d0fBA4E5eb50f9f5808e"; // Sua carteira que recebe os BNB
const TOKEN_CONTRACT = process.env.TOKEN_CONTRACT || "0xd9a8cde357c3FA0eC5571342023cA5A8b7F39384";
const TOKEN_DECIMAL = process.env.TOKEN_DECIMAL || "18";
const BSC_RPC_URL = process.env.BSC_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/";
const contractAbi = process.env.CONTRACT_ABI || '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"AccountIncludedInReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"e_matchPreSaleWallet","type":"address"}],"name":"EventMatchPreSaleWallet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"e_matchWalletGame","type":"address"}],"name":"EventMatchWalletGame","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"e_rfi","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_marketing","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_liquidity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_burn","type":"uint256"}],"name":"EventSetBuyRates","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"e_EnableTransferFrom","type":"bool"}],"name":"EventSetEnableContract","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"e_matchMarketing","type":"address"}],"name":"EventSetWalletMarketing","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"e_rfi","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_marketing","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_liquidity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_burn","type":"uint256"}],"name":"EventSetsellAndTransferRates","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"e_tokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"e_maticAmount","type":"uint256"}],"name":"LiquidityAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"Trading","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_enable","type":"bool"}],"name":"TrandingOn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"UniSwapV2Router","outputs":[{"internalType":"contract IUniSwapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_EnableTransferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxInAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxOutAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyRates","outputs":[{"internalType":"uint256","name":"rfi","type":"uint256"},{"internalType":"uint256","name":"marketing","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"burn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractBalance","outputs":[{"internalType":"uint256","name":"marketing_balance","type":"uint256"},{"internalType":"uint256","name":"lp_balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromReward","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lastBuyOrSellTime","type":"uint256"},{"internalType":"uint256","name":"lockTime","type":"uint256"}],"name":"lockToBuyOrSellForTime","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"matchPreSaleWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"matchWalletGame","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"numTokensToSwapLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokensToSwapMarketing","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferRfi","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sellAndTransferRates","outputs":[{"internalType":"uint256","name":"rfi","type":"uint256"},{"internalType":"uint256","name":"marketing","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"burn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sellTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rfi","type":"uint256"},{"internalType":"uint256","name":"marketing","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"burn","type":"uint256"}],"name":"setBuyRates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timeBetweenPurchases","type":"uint256"}],"name":"setBuyTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enable","type":"bool"}],"name":"setEnableContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_matchMarketing","type":"address"}],"name":"setMarketingAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_matchPreSaleWallet","type":"address"}],"name":"setMatchPreSaleWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_matchWalletGame","type":"address"}],"name":"setMatchWalletGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxInTokens","type":"uint256"}],"name":"setMaxInTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxOutTokens","type":"uint256"}],"name":"setMaxOutTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timeBetween","type":"uint256"}],"name":"setSellTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"top","type":"uint256"}],"name":"setTokenToSwapLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"top","type":"uint256"}],"name":"setTokenToSwapMarketing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rfi","type":"uint256"},{"internalType":"uint256","name":"marketing","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"burn","type":"uint256"}],"name":"setsellAndTransferRates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totFeesPaid","outputs":[{"internalType":"uint256","name":"rfi","type":"uint256"},{"internalType":"uint256","name":"marketing","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"burn","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniSwapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletToPurchaseTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletToSellTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]';

const DEPOSITO_URL = process.env.DEPOSITO_URL || "http://localhost:4300/processar";
const IDENTIFICADOR_URL = process.env.IDENTIFICADOR_URL || "http://localhost:4000/api/transacoes/identificador"; 

interface RequestData {
    identificador: string;
    cpf: string;
    quantidade: string;
    hash: string;
}

const Deposito = () => {
    const [cpf, setCpf] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [carteira, setCarteira] = useState('');
    const [saldoBnb, setSaldoBnb] = useState('');
    const [identificador, setIdentificador] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

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
    
        buscarIdentificador();
    }, []);

    const handleVoltarHome = () => {
        window.location.href = '/';
    };

    const maskCPF = (value:string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 6) {
            return digits.replace(/(\d{3})(\d+)/, '$1.$2');
        } else if (digits.length <= 9) {
            return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        } else {
            return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
        }
    }

    const maskToken = (value:string) => {
        return value.replace(/[^0-9]/g, '');
    }
    
    const handleQuantidade = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const maskedValue = maskToken(inputValue);
        setQuantidade(maskedValue);
    };
    
    const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const maskedValue = maskCPF(inputValue);
        setCpf(maskedValue);
    };

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
                    await buscarSaldoCarteira(_carteira);
                    await buscarSaldoBnb(_carteira);
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

    const buscarSaldoCarteira = async (carteira:string) => {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT, JSON.parse(contractAbi), provider);
        const balance: bigint = await tokenContract.balanceOf(carteira);
        const _quantidade = removeTokenDecimals(balance)
        setQuantidade(_quantidade);
    };

    const removeTokenDecimals = (value: bigint) => {
        const divisor = 10n ** BigInt(parseInt(TOKEN_DECIMAL));
        const wholePart = value / divisor;
        return wholePart.toString();
    }

    const buscarSaldoBnb = async (carteira:string) => {
        try {
          const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
          const balanceWei: bigint = await provider.getBalance(carteira);
          const balanceBNB = ethers.formatEther(balanceWei);
          setSaldoBnb(balanceBNB);
        } catch (error) {
          console.error("Erro ao obter saldo:", error);
          setSaldoBnb("Falha ao carregar saldo da carteira");
        }
    };


    const preTransaction = async () => {
        debugger;
        if (!window.ethereum) {
            alert("MetaMask não encontrada. Por favor, instale a extensão.");
            return;
        }

        try {
            setIsLoading(true);

            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            // console.log("Carteira conectada:", userAddress);
    
            // Instancia o contrato do token com o signer para poder enviar a transação
            const tokenContract = new ethers.Contract(TOKEN_CONTRACT, JSON.parse(contractAbi), signer);
      
            // Define o valor a ser transferido: 1 token (1 convertido para unidades mínimas, assumindo 18 decimais)
            const amount = ethers.parseUnits(quantidade, "ether");
      
            // Chama a função transfer do token para enviar a quantidade para o destinatário
            const txResponse = await tokenContract.transfer(RECEIVER_ADDRESS, amount);
            console.log("Transação enviada. Hash:", txResponse.hash);
            // Aguarda a confirmação da transação
            await txResponse.wait();

            let rs = await enviarDeposito(txResponse.hash);
            if (rs) {
                alert(`Transferência concluída com sucesso!`);
                handleVoltarHome();
            } else {
                alert("Falha na transação. Entre em contato com o administrador.");
            }
        } catch (error: any) {
            console.error("Erro na transação:", error);
            alert("Falha na transação: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const enviarDeposito = async (hash:string) => {
        const payload: RequestData = {
            identificador: identificador,
            cpf: cpf,
            quantidade: quantidade,
            hash: hash,
        };
  
        try {
            const response = await axios.post(DEPOSITO_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
  
            console.log("Resposta da API:", response.data);
            return true;
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            return false;
        }
    };

    return (
        <div>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }} ref={divRef}>
                {(carteira != "") && (
                    <Form style={{ width: '400px' }}>
                        <h1>Depósito</h1>

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

                        <Form.Group className="mb-3" controlId="formCarteira">
                            <Form.Label>Carteira</Form.Label>
                            <Form.Control
                                type="text"
                                value={carteira}
                                disabled={true}
                                placeholder="Carteira vinculada"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCpf">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control
                                type="text"
                                value={cpf}
                                onChange={handleCpf}
                                placeholder="Digite seu cpf"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantidade">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control
                                type="number"
                                value={quantidade}
                                onChange={handleQuantidade}
                                placeholder="Digite a quantidade"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCarteira">
                            <Form.Label>Saldo BNB</Form.Label>
                            <Form.Control
                                type="text"
                                value={saldoBnb}
                                disabled={true}
                                placeholder="Saldo em BNB"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={handleVoltarHome} disabled={isLoading}>
                                Home
                            </Button>
                            <Button variant="primary" onClick={preTransaction} disabled={isLoading}>
                                Continuar 
                            </Button>
                        </div>
                    </Form>
                )}
            
                {(carteira == "") && (
                    <Button onClick={handleConectarCarteira} style={{ marginRight: "0.5rem" }}>
                        Conectar Carteira
                    </Button>
                )}

            </Container>
        </div>
    );
};

export default Deposito;

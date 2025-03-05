import React, { useRef, useEffect, useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';
import axios from 'axios';

const TRANSACAO_AVULSO_URL = process.env.TRANSACAO_AVULSO_URL || "http://localhost:4300/avulso";

interface RequestData {
    identificador: string;
    hash: string;
    cpf: string;
    quantidade: string;
    tipo: string;
    carteira_de: string;
    carteira_para: string;
    gas_bnb: string;
}

const Avulso = () => {
    
    const [identificador, setIdentificador] = useState('');
    const [hash, setHash] = useState('');
    const [cpf, setCpf] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [tipo, setTipo] = useState('');
    const [carteiraDe, setCarteiraDe] = useState('');
    const [carteiraPara, setCarteiraPara] = useState('');
    const [gasBnb, setGasBnb] = useState('');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

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

    const handleEnviar = async () => {
        const payload: RequestData = {
            identificador: identificador,
            hash: hash,
            cpf: cpf,
            quantidade: quantidade,
            tipo: tipo,
            carteira_de: carteiraDe,
            carteira_para: carteiraPara,
            gas_bnb: gasBnb
        };
  
        try {
            setIsLoading(true);
            const response = await axios.post(TRANSACAO_AVULSO_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
  
            console.log("Resposta da API:", response.data);
            return true;
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Container className="d-flex justify-content-center align-items-center" ref={divRef}>
                <Form style={{ width: '400px' }}>
                    <h1>Transação avulso</h1>

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

                    <Form.Group className="mb-3" controlId="formIdentificador">
                        <Form.Label>Identificador</Form.Label>
                        <Form.Control
                            type="text"
                            value={identificador}
                            onChange={(e) => setIdentificador(e.target.value)}
                            placeholder="Digite o identificador"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formHash">
                        <Form.Label>Hash</Form.Label>
                        <Form.Control
                            type="text"
                            value={hash}
                            onChange={(e) => setHash(e.target.value)}
                            placeholder="Digite o hash"
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
                    <Form.Group className="mb-3" controlId="formTipo">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            type="text"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            placeholder="Digite o tipo"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCarteiraDe">
                        <Form.Label>Carteira de</Form.Label>
                        <Form.Control
                            type="text"
                            value={carteiraDe}
                            onChange={(e) => setCarteiraDe(e.target.value)}
                            placeholder="Digite a carteira de"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCarteiraPara">
                        <Form.Label>Carteira para</Form.Label>
                        <Form.Control
                            type="text"
                            value={carteiraPara}
                            onChange={(e) => setCarteiraPara(e.target.value)}
                            placeholder="Digite a carteira para"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCarteiraPara">
                        <Form.Label>Gas BNB</Form.Label>
                        <Form.Control
                            type="text"
                            value={gasBnb}
                            onChange={(e) => setGasBnb(e.target.value)}
                            placeholder="Digite o valor do gas"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={handleVoltarHome} disabled={isLoading}>
                            Home
                        </Button>
                        <Button variant="primary" onClick={handleEnviar} disabled={isLoading}>
                            Salvar 
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default Avulso;

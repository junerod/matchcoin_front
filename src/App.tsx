import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Saque from "./pages/Saque";
import Deposito from './pages/Deposito';
import Avulso from "./pages/Avulso";

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
                        <Nav.Link href="/avulso">Avulso</Nav.Link>
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
                <Route path="/avulso" element={<Avulso />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;

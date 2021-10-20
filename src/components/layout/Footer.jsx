import {Card, Container} from "react-bootstrap";
import CookieConsent from "react-cookie-consent";

export const Footer = () => {
    return <>
        <br/>
        <Card>
            <Card.Footer/>
            <Container>
                <Card.Body>
                    <Card.Title> <i>FyreFly</i></Card.Title>
                    <Card.Text>All Rights Reserved, Copyright &copy; {new Date().getFullYear()}</Card.Text>
                </Card.Body>
            </Container>
        </Card>
        <CookieConsent style={{background: "#eee", color: "#000"}}>
            <span style={{fontSize: 12}}>This app uses cookies to give you the best, most relevant experience. Using this app means you're Ok with this. <b>D2G Group LLC</b>&trade;</span>
        </CookieConsent>
    </>
}
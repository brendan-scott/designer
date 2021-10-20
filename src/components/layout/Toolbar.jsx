import {Col, Nav, Row, Tab} from "react-bootstrap";
import {OptionsPane} from "./panes/OptionsPane";
import {TextPane} from "./panes/TextPane";
import {GraphicsPane} from "./panes/GraphicsPane";
import {NotesPane} from "./panes/NotesPane";

export const Toolbar = ({dragElementRef}) => {
    return <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
            <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                        <Nav.Link eventKey="options">Options</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="text">Text</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="graphics">Graphics</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="notes">Order Notes</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Col>
            <Col sm={9}>
                <Tab.Content>
                    <OptionsPane/>
                    <TextPane dragElementRef={dragElementRef}/>
                    <GraphicsPane dragElementRef={dragElementRef}/>
                    <NotesPane/>
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
}
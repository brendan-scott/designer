import React, {useRef} from 'react'
import {Container, Col, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {Canvas} from "./components/Canvas";
import {Header} from "./components/layout/Header";
import {Footer} from "./components/layout/Footer";
import {Toolbar} from "./components/layout/Toolbar";
import {ElementToolBar} from "./components/layout/ElementToolBar";
import {Layers} from "./components/layout/Layers";
import {ActionCreators} from "redux-undo";
import 'bootstrap/dist/css/bootstrap.min.css'

const mapStateToProps = (state) => ({
    past: state.elements.past,
    future: state.elements.future
})

const mapDispatchToProps = ({
    onUndo: ActionCreators.undo,
    onRedo: ActionCreators.redo
})

let App = ({past, future, onUndo, onRedo}) => {
    const stageRef = useRef();
    const layerRef = useRef();
    const dragElementRef = useRef();

    return (
        <div>
            <Header stageRef={stageRef} layerRef={layerRef} past={past} future={future} onUndo={onUndo} onRedo={onRedo}/>
            <Layers/>
            <Container>
                <Row>
                    <Col xs='4'>
                        <Toolbar dragElementRef={dragElementRef}/>
                        <ElementToolBar/>
                    </Col>
                    <Col xs='8'>
                        <Canvas stageRef={stageRef} layerRef={layerRef} dragElementRef={dragElementRef}/>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    );
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
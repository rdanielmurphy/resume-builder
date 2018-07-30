import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from 'react-dom';
import brace from 'brace';
import { split as SplitEditor } from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';

function onChange(newValue) {
	console.log('change', newValue);
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			splits: 2,
			orientation: 'beside',
			value: '',
			theme: 'github',
			mode: 'xml',
			enableBasicAutocompletion: false,
			enableLiveAutocompletion: false,
			fontSize: 14,
			showGutter: true,
			showPrintMargin: true,
			highlightActiveLine: true,
			enableSnippets: false,
			showLineNumbers: true
		};
	}

	componentDidMount() {
		fetch("/api/version")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						version: result.version
					});
				},
				(error) => {
					alert(error);
				}
			)
		fetch("/api/resume/sample")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						value: [result.template, result.data]
					});
				},
				(error) => {
					alert(error);
				}
			)
	}

	render() {
		return (
			<div>
				<div className="columns">
					<div className="column">
						<h1>Resume Editor v{this.state.version}</h1>
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<h3>Template</h3>
					</div>
					<div class="column">
						<h3>Data</h3>
					</div>
				</div>
				<div className="columns">
					<div className="column">
						<SplitEditor
							mode="xml"
							theme="github"
							splits={2}
							value={this.state.value}
							name="asd"
							width="100%"
							height="1300px"
							editorProps={{ $blockScrolling: true }}
						/>
					</div>
				</div >
			</div >
		);
	}
}

export default App;

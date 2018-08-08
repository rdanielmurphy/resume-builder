import React, { Component } from 'react';
import './App.css';
import { split as SplitEditor } from 'react-ace';
import 'brace/mode/xml';
import 'brace/theme/github';
import { saveAs } from 'file-saver/FileSaver';

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

	generateClick(e) {
		const type = 'docx';
		const body = {
			"template": this.state.value[0],
			"data": this.state.value[1],
			"type": type
		};
		fetch('/api/resume/generate', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}).then(function (response) {
			return response.blob();
		}).then(blob => {
			saveAs(blob, "resume." + type);
		});
	}

	onChange = (newValue) => {
		this.setState({
			value: newValue
		});
	}

	render() {
		return (
			<div>
			<div className="columns">
			<div className="column">
			<h1>Resume Editor v{this.state.version}</h1>
			<button onClick={(e) => this.generateClick(e)}>
			Generate Resume
			</button>
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
			height="1100px"
			onChange={(newValue) => this.onChange(newValue)}
			editorProps={{ $blockScrolling: true }}
			/>
			</div>
			</div >
			</div >
		);
	}
}

export default App;

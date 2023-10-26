import React from 'react';
import FileSaver from 'file-saver';
import {AppContext} from './AppContext';

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.download = this.download.bind(this);
  }

  download () {
    const firstLine = this.props.text.replace(/[",.!-::']/g , "");
    const length = firstLine.indexOf(" ", 25);
    const title = firstLine.substr(0, length > 0 ? length : 30);
    const date = new Date(this.props.finishTime * 1000).toLocaleDateString();
    // Replace clean newlines with windows evil
    const text = this.props.text.replace(/([^\r])\n/g, "$1\r\n");
    const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    const filename = `${title} (MDWA ${date}).txt`;
    FileSaver.saveAs(blob, filename);
  }

  render() {
    return (
      <AppContext.Consumer>
      { ({words}) =>
          <button onClick={this.download} className="tiny ghost">Download { words || 0 } { words === 1 ? "word" : "words" }</button>
      }
      </AppContext.Consumer>
    )
  }
}

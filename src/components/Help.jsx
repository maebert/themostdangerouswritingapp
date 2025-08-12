import React from "react";
import WriteButton from "./WriteButton";
import Space from "./Space";
import { Link } from "react-router-dom";

const renderQuote = ({ text, author, url }) => {
  return (
    <blockquote cite={url} key={author}>
      <p>
        <i className="icon-quote-left" />
        {text}
        <i className="icon-quote-right" />
      </p>
      <p className="author">
        &mdash; <a href={url}>{author}</a>
      </p>
    </blockquote>
  );
};

export default class Help extends React.Component {
  static quotes = [
    {
      text: "Sadistic [and] brutal.",
      author: "WIRED",
      url:
        "https://www.wired.com/2016/03/sadistic-writing-app-deletes-work-stop-typing/"
    },
    {
      text: "@maebert has created the writer's nightmare machine.",
      author: "@danhklein",
      url: "https://twitter.com/danhklein/status/704701084908978176"
    },
    {
      text:
        "I am panicking just reading the description, which should count as a ringing endorsement.",
      author: "Some Guy on Metafilter",
      url:
        "http://www.metafilter.com/157549/The-Most-Frustrating-Writing-Webpage#6422455"
    }
  ];

  componentDidMount() {
    if (window.plausible) window.plausible('Help')
  }

  render() {
  return (
    <div className="Help">
      <Link to="/" className="navButton backButton">
        Back
      </Link>
      <Space l />
      <div className="content">
        <div className="logo small">
          <div className="mark" />
          <h1>
            <span>The Most</span>
            <span>Dangerous</span>
            <span>
              Writing App
              <i className="caret icon-cursor" />
            </span>
          </h1>
        </div>

        <h1>Help</h1>
        <h2>What's the point?</h2>
        <p>
          The Most Dangerous Writing App is designed to shut down your inner
          editor and get you into a state of flow. If you stop typing for more
          than five seconds, all progress will be lost. After typing without
          interruption for the length of your session, you'll be able to save
          your work.
        </p>
        <p>
          Because 'tis better to have written and lost, than never to have
          written at all.
        </p>

        <Space m />
        <WriteButton ghost color="red" />

        <h2>Word on the street?</h2>

        <p>
          <abbr title="The Most Dangerous Writing App">MDWA</abbr> has been
          featured on&nbsp;
          <a
            href="http://www.wired.com/2016/03/sadistic-writing-app-deletes-work-stop-typing/"
            title="Wired"
          >
            Wired
          </a>
          ,&nbsp;
          <a
            href="http://lifehacker.com/the-most-dangerous-writing-app-destroys-your-progress-1762981262"
            title="Lifehacker"
          >
            Lifehacker
          </a>
          ,&nbsp;
          <a
            href="http://thenextweb.com/apps/2016/03/07/this-writing-app-will-delete-your-work-if-you-stop-typing/"
            title="The Next Web"
          >
            The Next Web
          </a>
          ,&nbsp;
          <a
            href="http://www.huffingtonpost.com/2016/03/07/the-most-dangerous-writing-app-is-a-terrifying-productivity-tool_n_9399844.html"
            title="Huffington Post"
          >
            Huffington Post
          </a>
          ,&nbsp;
          <a
            href="https://me.popsugar.com/technology/Why-Most-Dangerous-Writing-App-Make-You-More-Productive-40420571"
            title="PopSugar"
          >
            PopSugar
          </a>
          , and many, many other outlets. Here's what some people have to say:
        </p>

        {Help.quotes.map(quote => renderQuote(quote))}

        <h2>Who made this?</h2>
        <p>
          <i className="icon-mdwa" />{" "}
          <abbr title="The Most Dangerous Writing App">MDWA</abbr> was written
          by{" "}
          <a
            href="https://www.x.com/maebert"
            rel="noopener noreferrer"
            target="_blank"
            title="Manu Ebert"
          >
            Manu Ebert
          </a>{" "}
          over two glasses of wine on a Sunday afternoon and is{" "}
          <a
            title="MDWA on Github"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.github.com/maebert/themostdangerouswritingapp"
          >
            <i className="icon-github" />open source
          </a>
          .
        </p>

        <p>
          The domain <a href="https://themostdangerouswritingapp.com">themostdangerouswritingapp.com</a> has been acquired by <a href="https://www.squibler.io" title="Squibler">Squibler</a>, who now maintain and continue to develop the app.{" "}
          This is the the original version of the app, which will continue to be available at <a href="https://maebert.github.io/themostdangerouswritingapp">maebert.github.io/themostdangerouswritingapp</a>.
        </p>


        <h2>Can anybody read what I write?</h2>
        <p>
          No, all your writing is private and not submitted to or stored on any
          server.
        </p>

        <h2>Press Kit</h2>
        <p>
          If you would like to write about{" "}
          <abbr title="The Most Dangerous Writing App">MDWA</abbr>, please use
          the media in the <a href="https://maebert.github.io/themostdangerouswritingapp/assets/MDWA Press Kit.zip">press kit</a> provided.{" "}
        </p>
        <p>
          I'm happy to answer your questions over{" "}
          <a href="mailto:manuel@1450.me?subject=The%20Most%20Dangerous%20Writing%20App">
            e-mail
          </a>{" "}
          or{" "}
          <a
            href="https://www.twitter.com/maebert"
            rel="noopener noreferrer"
            target="_blank"
            title="Manu Ebert"
          >
            twitter
          </a>
          , too.
        </p>

        <Space l />
      </div>
    </div>
  );
}
};


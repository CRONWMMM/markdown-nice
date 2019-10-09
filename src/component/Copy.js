import React, {Component} from "react";
import juice from "juice";
import {observer, inject} from "mobx-react";
import {Button, message, ConfigProvider, notification} from "antd";

import {BASIC_THEME_ID, CODE_THEME_ID, MARKDOWN_THEME_ID} from "../utils/constant";

import {axiosMdnice} from "../utils/helper";

@inject("content")
@inject("navbar")
@inject("imageHosting")
@inject("dialog")
@observer
class Copy extends Component {
  constructor(props) {
    super(props);
    this.mathNums = 0;
    this.html = "";
    this.scale = 2;
    this.state = {
      loading: false,
    };
  }

  // 形成结果 <div class="katex-display"><img class="math-img-block"/></div>
  solveBlockMath = async () => {
    const tagsBlock = document.getElementsByClassName("block-equation");
    for (let i = 0; i < tagsBlock.length; i++) {
      var svg = tagsBlock[i].firstChild;
      const width = svg.getAttribute("width");
      if (width === null) {
        break;
      }
      const height = svg.getAttribute("height");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.style.width = width;
      svg.style.height = height;
    }
  };

  solveMath = async () => {
    const svgArr = document.getElementsByTagName("svg");
    for (let i = 0; i < svgArr.length; i++) {
      if (!svgArr.hasAttribute("style")) {
        continue;
      }
      var svg = svgArr[i];
      const width = svg.getAttribute("width");
      if (width === null) {
        break;
      }
      const height = svg.getAttribute("height");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.style.width = width;
      svg.style.height = height;
    }
  };

  solveHtml = () => {
    const element = document.getElementById("wx-box");
    const basicStyle = document.getElementById(BASIC_THEME_ID).innerText;
    const markdownStyle = document.getElementById(MARKDOWN_THEME_ID).innerText;
    const codeStyle = document.getElementById(CODE_THEME_ID).innerText;
    this.html = juice.inlineContent(element.innerHTML, basicStyle + markdownStyle + codeStyle, {
      inlinePseudoElements: true,
    });
  };

  // 拷贝流程 块级公式 => 行内公式 => 其他
  copy = async () => {
    try {
      this.setState({loading: true});
      this.solveMath();
    } catch (e) {
      message.error(e.message);
    } finally {
      this.solveHtml();
      document.addEventListener("copy", this.copyListener);
      document.execCommand("copy");
      document.removeEventListener("copy", this.copyListener);
      this.setState({loading: false});
    }
  };

  copyListener = (e) => {
    // 由于antd的message原因，有这行输出则每次都会进来，否则有问题，具体原因不明
    // console.log("clipboard");
    message.success("已复制，请到微信公众平台粘贴");
    e.clipboardData.setData("text/html", this.html);
    e.clipboardData.setData("text/plain", this.html);
    e.preventDefault();
  };

  render() {
    return (
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button type="primary" style={style.btnHeight} onClick={this.copy} loading={this.state.loading}>
          复制
        </Button>
      </ConfigProvider>
    );
  }
}

const style = {
  btnHeight: {
    height: "30px",
  },
  mathNotify: {
    padding: 0,
    fontSize: "14px",
    lineHeight: "20px",
    color: "rgba(0,0,0,0.65)",
  },
  close: {
    padding: 0,
  },
};

export default Copy;

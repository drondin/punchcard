(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{140:function(e){e.exports=JSON.parse('{"1":{"Punchcard":["0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1"]},"100":{"Punchcard":["0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1"]},"137":{"Punchcard":["0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1"]},"80001":{"Punchcard":["0x3f55C33e88F43065AcF5381175B324D54392861A"]}}')},277:function(e,t,n){e.exports=n(777)},282:function(e,t,n){},284:function(e,t,n){},294:function(e,t){},318:function(e,t){},320:function(e,t){},384:function(e,t){},386:function(e,t){},418:function(e,t){},423:function(e,t){},425:function(e,t){},449:function(e,t){},573:function(e,t){},581:function(e,t){},596:function(e,t){},597:function(e,t){},776:function(e,t,n){var a={"./1/0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1.json":[778,3],"./100/0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1.json":[779,4],"./137/0x632fE6804f3B057a150DC5Df78C62cC058b2f0F1.json":[780,5],"./80001/0x3f55C33e88F43065AcF5381175B324D54392861A.json":[781,6],"./map.json":[140]};function r(e){if(!n.o(a,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=a[e],r=t[0];return Promise.all(t.slice(1).map(n.e)).then((function(){return n.t(r,3)}))}r.keys=function(){return Object.keys(a)},r.id=776,e.exports=r},777:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),c=n(275),o=n.n(c),l=(n(282),n(0)),s=n.n(l),u=n(23),i=n(9),d=n(11),f=n(17),p=n(16),m=(n(284),n(101)),h=n.n(m),x=function(){var e=Object(u.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("complete"===document.readyState){e.next=5;break}return e.next=3,new Promise((function(e){return setTimeout(e,100)}));case 3:e.next=0;break;case 5:return e.abrupt("return",window.ethereum);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),b=function(){var e=Object(u.a)(s.a.mark((function e(){var t,n,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x();case 2:return(t=e.sent)?n=new h.a(t):window.web3?n=window.web3:(a=new h.a.providers.HttpProvider("http://127.0.0.1:8545"),n=new h.a(a)),e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),E=n(140),v=n(276),w=n(20);function g(e){var t=e.children;return r.a.createElement("div",{style:{display:"flex",flexFlow:"row wrap"}},t)}function y(e){var t=e.children,n=e.size,a=void 0===n?1:n;return r.a.createElement("div",{style:{flex:a}},t)}var C=function(e){Object(f.a)(a,e);var t=Object(p.a)(a);function a(){var e;Object(i.a)(this,a);for(var r=arguments.length,c=new Array(r),o=0;o<r;o++)c[o]=arguments[o];return(e=t.call.apply(t,[this].concat(c))).state={web3:null,ipfsclient:null,accounts:null,chainid:null,punchcard:null,mintedFree:!0,nOwnedPunchcards:0,ownedPunchcards:[],mintValue:5,contentValue:"",selectedPunchcard:null,ipfsBaseUri:null,fileContent:"",sendAddress:null,walletConnected:!1,pendingTx:[],chainError:!1,chainExplorer:null},e.componentDidMount=Object(u.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:"undefined"===typeof web3?console.log("not connected"):e.initApp();case 1:case"end":return t.stop()}}),t)}))),e.initApp=Object(u.a)(s.a.mark((function t(){var n,a,r,c,o;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b();case 2:return n=t.sent,a=!1,t.prev=4,t.next=7,x();case 7:t.sent.enable(),a=!0,t.next=16;break;case 12:t.prev=12,t.t0=t.catch(4),console.log("Could not enable accounts. Interaction with contracts not available.\n            Use a modern browser with a Web3 plugin to fix this issue."),console.log(t.t0);case 16:return t.next=18,n.eth.getAccounts();case 18:return r=t.sent,t.t1=parseInt,t.next=22,n.eth.getChainId();case 22:return t.t2=t.sent,c=(0,t.t1)(t.t2),o=null,1===c?o="https://etherscan.io":100===c?o="https://blockscout.com/xdai/mainnet":137===c&&(o="https://polygonscan.com"),window.ethereum&&window.ethereum.on("accountsChanged",(function(e){window.location.reload()})),t.t3=e,t.t4={web3:n,accounts:r,chainid:c,walletConnected:a,chainExplorer:o},t.next=31,e.loadInitialContracts;case 31:t.t5=t.sent,t.t3.setState.call(t.t3,t.t4,t.t5);case 33:case"end":return t.stop()}}),t,null,[[4,12]])}))),e.loadData=Object(u.a)(s.a.mark((function t(){var n,a,r,c,o,l,u,i,d,f,p,m,h,x,b;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.state,a=n.accounts,r=n.punchcard,c=n.selectedPunchcard,o=n.ipfsBaseUri,t.next=3,r.methods.callerHasClaimedFreeToken().call({from:a[0]});case 3:return l=t.sent,t.next=6,r.methods.balanceOf(a[0]).call({from:a[0]});case 6:u=t.sent,i=[],d=c,f=!1,p=0;case 11:if(!(p<u)){t.next=27;break}return t.next=14,r.methods.tokenOfOwnerByIndex(a[0],p).call({from:a[0]});case 14:return m=t.sent,t.next=17,r.methods.getContent(m).call({from:a[0]});case 17:return h=t.sent,t.next=20,r.methods.contentIsSet(m).call({from:a[0]});case 20:x=t.sent,b={id:m,content:h,isSet:x},d&&d.id===b.id&&(d=b,fetch(o+b.content).then((function(e){return e.text()})).then((function(t){e.setState({fileContent:t})})),f=!0),i.push(b);case 24:p++,t.next=11;break;case 27:(null===d||!1===f)&&u>0?d=i[0]:0===u&&(d=null),e.setState({mintedFree:l,nOwnedPunchcards:u,ownedPunchcards:i,selectedPunchcard:d});case 29:case"end":return t.stop()}}),t)}))),e.loadInitialContracts=Object(u.a)(s.a.mark((function t(){var n,a,r,c;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.state.chainid,t.next=3,e.loadContract(n.toString(),"Punchcard");case 3:if(a=t.sent,1===n||137===n||100===n){t.next=7;break}return e.setState({chainError:!0}),t.abrupt("return");case 7:if(a){t.next=9;break}return t.abrupt("return");case 9:return t.next=11,a.methods.baseURI().call();case 11:r=t.sent,c=Object(v.create)("https://ipfs.infura.io:5001/api/v0"),e.setState({punchcard:a,ipfsclient:c,ipfsBaseUri:r}),e.state.accounts.length>0&&e.loadData();case 15:case"end":return t.stop()}}),t)}))),e.loadContract=function(){var t=Object(u.a)(s.a.mark((function t(a,r){var c,o,l;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:c=e.state.web3,t.prev=1,o=E[a][r][0],t.next=9;break;case 5:return t.prev=5,t.t0=t.catch(1),console.log("Couldn't find any deployed contract \"".concat(r,'" on the chain "').concat(a,'".')),t.abrupt("return",void 0);case 9:return t.prev=9,t.next=12,n(776)("./".concat(a,"/").concat(o,".json"));case 12:l=t.sent,t.next=19;break;case 15:return t.prev=15,t.t1=t.catch(9),console.log('Failed to load contract artifact "./artifacts/deployments/'.concat(a,"/").concat(o,'.json"')),t.abrupt("return",void 0);case 19:return t.abrupt("return",new c.eth.Contract(l.abi,o));case 20:case"end":return t.stop()}}),t,null,[[1,5],[9,15]])})));return function(e,n){return t.apply(this,arguments)}}(),e.mintFree=function(){var t=Object(u.a)(s.a.mark((function t(n){var a,r,c,o;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.state,r=a.accounts,c=a.punchcard,o=a.pendingTx,t.next=3,c.methods.claimFreeToken().send({from:r[0]}).on("transactionHash",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(a=o).push({tx:n,msg:"Minting free Punched Card"}),e.setState({pendingTx:a});case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()).on("receipt",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=o.filter((function(e){return e.tx!==n.transactionHash})),e.setState({pendingTx:a}),e.loadData();case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.mintPunchcards=function(){var t=Object(u.a)(s.a.mark((function t(n){var a,r,c,o,l,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.state,r=a.accounts,c=a.punchcard,o=a.mintValue,l=a.pendingTx,i=a.web3,t.next=3,c.methods.mintTokens(o).send({from:r[0],value:o*i.utils.toWei("0.001","ether")}).on("transactionHash",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(a=l).push({tx:n,msg:"Minting Punched Cards"}),e.setState({pendingTx:a});case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()).on("receipt",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:console.log("minted punchards"),a=l.filter((function(e){return e.tx!==n.transactionHash})),e.setState({pendingTx:a,mintValue:5}),e.loadData();case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.sendPunchcard=function(){var t=Object(u.a)(s.a.mark((function t(n){var a,r,c,o,l,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.state,r=a.accounts,c=a.punchcard,o=a.selectedPunchcard,l=a.pendingTx,i=a.sendAddress,t.next=3,c.methods.transferFrom(r[0],i,o.id).send({from:r[0]}).on("transactionHash",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(a=l).push({tx:n,msg:"Sending Punched Card"}),e.setState({pendingTx:a});case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()).on("receipt",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=l.filter((function(e){return e.tx!==n.transactionHash})),e.setState({sendAddress:"",pendingTx:a}),e.loadData();case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e.uploadTextIPFS=function(){var t=Object(u.a)(s.a.mark((function t(n){var a,r,c,o,l,i,d,f;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.state,r=a.ipfsclient,c=a.contentValue,o=a.accounts,l=a.punchcard,i=a.pendingTx,d=a.selectedPunchcard,t.next=3,r.add(c);case 3:return f=t.sent,t.next=6,l.methods.setContent(d.id,f.path).send({from:o[0]}).on("transactionHash",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(a=i).push({tx:n,msg:"Sending Punched Card"}),e.setState({pendingTx:a});case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()).on("receipt",function(){var t=Object(u.a)(s.a.mark((function t(n){var a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=i.filter((function(e){return e.tx!==n.transactionHash})),e.setState({contentValue:"",pendingTx:a}),e.loadData();case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e}return Object(d.a)(a,[{key:"render",value:function(){var e=this,t=this.state,n=t.accounts,a=t.mintedFree,c=t.nOwnedPunchcards,o=t.ownedPunchcards,l=t.mintValue,s=t.contentValue,u=t.selectedPunchcard,i=t.ipfsBaseUri,d=t.sendAddress,f=t.walletConnected,p=t.fileContent,m=t.pendingTx,h=t.chainError,x=t.chainExplorer,b=m.map((function(e){return r.a.createElement("li",{key:e.tx},r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:x+"/tx/"+e.tx},e.msg))})),E=o.map((function(t){return r.a.createElement("li",{key:t.id,onClick:function(n){e.setState({selectedPunchcard:t}),t.content&&fetch(i+t.content).then((function(e){return e.text()})).then((function(t){e.setState({fileContent:t})}))},style:{margin:"1rem",color:t===u&&"#007bff"}},"Punched Card ",t.id," - ",r.a.createElement(w.d,{icon:"star",empty:!1===t.isSet,small:!0}))})),v=!!n&&n.length>0;return r.a.createElement("div",{className:"App",style:{marginLeft:"auto",marginRight:"auto",marginTop:15,width:1024}},r.a.createElement("link",{href:"https://fonts.googleapis.com/css?family=Press+Start+2P",rel:"stylesheet"}),r.a.createElement("h2",null,"Punchedcard.eth.link"),r.a.createElement("br",null),r.a.createElement(w.c,{dark:!0,title:"What is this?"},"You ever wanted to send a message to another wallet or save a document forever? ",r.a.createElement("br",null)," ",r.a.createElement("br",null)," Mint NFTs wiht text saved on IPFS "," ",r.a.createElement(w.d,{icon:"heart"}),r.a.createElement("br",null),r.a.createElement("br",null),"Made by ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://twitter.com/drondin0x"},"@drondin0x")," on Ethereum, xDAI and Polygon."),r.a.createElement("br",null),!f||0===n.length||h?r.a.createElement(w.c,{rounded:!0},r.a.createElement(w.b,{success:!0,onClick:function(t){return e.initApp()}},"Connect with Metamask."),r.a.createElement("br",null),r.a.createElement("br",null),"Only available on Ethereum, Polygon or xDai."):r.a.createElement("div",null,r.a.createElement(w.c,{rounded:!0},r.a.createElement("strong",null,"Connected with account"," ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:x+"/address/"+n[0]}," ",n[0]," "))),r.a.createElement("br",null),r.a.createElement(w.c,{rounded:!0,title:"Mint Punched Card"},r.a.createElement(g,null,r.a.createElement(y,null,!v||a?r.a.createElement("div",{style:{display:"flex"}},r.a.createElement(w.e,{sprite:"bcrikko",style:{alignSelf:"flex-end"}}),r.a.createElement(w.a,{style:{margin:"2rem",maxWidth:"400px"},fromLeft:!0},r.a.createElement(w.g,{label:"How many Punched Cards do you want?",placeholder:"Text placeholder",type:"number",value:l,onChange:function(t){return e.setState({mintValue:t.target.value})}}),r.a.createElement("br",null),r.a.createElement(w.b,{success:!0,onClick:function(t){return e.mintPunchcards(t)}},"Mint ",l," punched cards"))):r.a.createElement("div",{style:{display:"flex"}},r.a.createElement(w.e,{sprite:"bcrikko",style:{alignSelf:"flex-end"}}),r.a.createElement(w.a,{style:{margin:"2rem",maxWidth:"400px"},fromLeft:!0},r.a.createElement("span",null,"Welcome, the first punchard is on the house!"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.b,{success:!0,onClick:function(t){return e.mintFree(t)}},"Mint free punched card")))),r.a.createElement(y,{style:{textAlign:"left"}},r.a.createElement("p",null,"Rules"),r.a.createElement("div",{style:{textAlign:"left"}},r.a.createElement(w.d,{icon:"like",small:!0}),r.a.createElement("span",{style:{marginLeft:"5px"}},"You can mint as many Punched Cards as you want"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.d,{icon:"like",small:!0}),r.a.createElement("span",{style:{marginLeft:"5px"}},"Each Punched Card costs 0.001 Ether"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.d,{icon:"like",small:!0}),r.a.createElement("span",{style:{marginLeft:"5px"}},"You can set the content of a Punched Card only 1 time"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.d,{icon:"like",small:!0}),r.a.createElement("span",{style:{marginLeft:"5px"}},"The content is public and accessible by anyone"))))),r.a.createElement("br",null),c>0||m.length>0?r.a.createElement(g,null,r.a.createElement(y,null,r.a.createElement(w.c,{rounded:!0,title:"My Punched Cards"},E),r.a.createElement("br",null),m.length>0?r.a.createElement(w.c,{rounded:!0,title:"Transactions"},b):null),r.a.createElement(y,null,r.a.createElement(w.c,{rounded:!0,title:"Content"},u&&!1===u.isSet&&r.a.createElement(w.f,{value:s,onChange:function(t){return e.setState({contentValue:t.target.value})},rows:"8"}),u&&u.isSet&&r.a.createElement("div",null,r.a.createElement(w.f,{value:p,disabled:!0,rows:"8"}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("a",{href:i+u.content,target:"_blank",rel:"noopener noreferrer"},"IPFS URL"),r.a.createElement("br",null),r.a.createElement("br",null)),u&&!1===u.isSet&&r.a.createElement("div",null,r.a.createElement("br",null),r.a.createElement(w.b,{warning:!0,onClick:function(t){return!1===u.isSet&&e.uploadTextIPFS(t)},disabled:u&&u.isSet},"Set Content ",u.id),r.a.createElement("br",null),r.a.createElement("br",null))),r.a.createElement("br",null),u&&r.a.createElement(w.c,{rounded:!0,title:"Send Punched Card"},r.a.createElement(w.f,{label:"Enther Address",type:"text",value:d,onChange:function(t){return e.setState({sendAddress:t.target.value})}}),r.a.createElement(w.b,{error:!0,style:{"margin-top":"20px"},onClick:function(t){return e.sendPunchcard(t)}},"Send Punchcard ",u.id)))):r.a.createElement("div",null)))}}]),a}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(C,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[277,1,2]]]);
//# sourceMappingURL=main.7addfec6.chunk.js.map
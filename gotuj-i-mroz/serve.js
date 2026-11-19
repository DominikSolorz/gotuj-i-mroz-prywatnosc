const http=require("http"),fs=require("fs"),path=require("path");
http.createServer((q,r)=>{
  const f=path.join(__dirname,"www",q.url==="/"?"index.html":q.url.split("?")[0]);
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});r.end(d);});
}).listen(5173);

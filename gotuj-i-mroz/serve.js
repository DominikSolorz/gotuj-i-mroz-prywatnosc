const http=require("http"),fs=require("fs"),path=require("path");
const TYPES={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".ogg":"audio/ogg",".mp3":"audio/mpeg"};
http.createServer((q,r)=>{
  const u=decodeURIComponent(q.url.split("?")[0]);
  const f=path.normalize(path.join(__dirname,"www",u==="/"?"index.html":u));
  if(!f.startsWith(path.join(__dirname,"www"))){r.writeHead(403);r.end();return;}
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{"Content-Type":TYPES[path.extname(f)]||"application/octet-stream"});r.end(d);});
}).listen(5173);

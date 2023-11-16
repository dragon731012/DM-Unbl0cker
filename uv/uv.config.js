var servers = ['https://bare.starttiw.org','https://math.thegalleryofart.org/outerspace/','https://gointerstellar.app/outerspace/','https://bare-server-lg7h.onrender.com'];
var bareserver;

function getserver(server) {
  fetch(server)
      .then((response) => {
        return response.text();
      })
      .then((res) => {
        return "yes";
      })
      .catch((error) => {
        return "no";
      });
}
  
for (var i = 0; i < servers.length; i++) {
  var res=getserver(servers[i]);
  if (res != 'no') {
    bareserver = servers[i];
    break;
  }
}

self.__uv$config = {
    prefix: '/service/',
    bare: bareserver,
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
  };

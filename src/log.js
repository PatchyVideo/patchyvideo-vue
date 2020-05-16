global.log = function() {
  console.log(
    "%cPatchy%cVideo%c" + process.env.VUE_APP_VERSION + "%c\nBuilt at: " + process.env.VUE_APP_BUILDTIME,
    "color:#9c71b2;font-size:2rem;font-family: Arial,Helvetica,sans-serif;padding: 5px;font-weight: 700;",
    "color:#ffb458;font-size:2rem;font-family: Arial,Helvetica,sans-serif;padding: 5px;font-weight: 700;",
    "color:#6a8935;font-size:0.9rem;font-family: Arial,Helvetica,sans-serif;padding: 5px;",
    "color:#c586c0;font-size:1rem;font-family: Arial,Helvetica,sans-serif;padding: 0 5px;"
  );
  if (localStorage.getItem("CON_color_icon")) {
    const str = "Color Mode Enabled.";
    let c = [""];
    const colors = ["color:red", "color:orange", "color:green", "color:blue"];
    for (const i in str) {
      c[0] += "%c" + str[i];
      c.push(colors[i % 4]);
    }
    console.log.apply(this, c);
  }
};

global.log();
console.log("朋友，你知道 东方Project 吗？我让你加群，好吗？QQ群：757676234");

const logicon = `                                                         _LL::;cL;
                                ;Z8,:;L7ixF1jJ7TJ7ijFx77g@g@gX, ;LXC_
                        :;;Lc4@QpcxL;:'                    ';70,   :XE      :;
                    ;7iL;:,;Lx'                     ;_        L@  .  K8  ;EEc@S_
                  LT;' '":;'      _:;;;;;;;;;,:_    D1        ZC  ..  Egg6;' ';LTKj;
                L7  ''         ,;;"            ';;, J;c_    _JC   ..  p,           ;CF_
               6G L; __,,:_;ic"                    '8; ;LL;LL; .... T;               CE
            J7i1LF7:'     ;,    __,LL;;LLLL;;,_      4L ..:....... .ci                 jS
           ;g:'         LCL;LxsUwaDAIMyOjiNcTj1XX37;  EL;;,:,:,:,;LCO                  ;@
          cS;        ,,TgL;;;:LKE7L"'''       ''"L1FSE1L_LxTTcTcRRL:Lx;;;,:.          _;g
        Lx_  _;LO6;  : ,;7c;:K8L:'  ___:___:___   "Lc3i1:  .     L;       ":,;;;     :  6
      i4L,Lc7c;CXc6L      _LE@;   ,:,:,,:_::,,,;___ ;LpLK ...     ,J:           Kj;:'   Q
      gE;;;;;,16cixEKxcxcc7;;j   ;:    ' '     L:;;: :4D, ..;:      i7LLL;_      GQR@DSZ8ZD;
       xR1;,,cX;;,;:,;;;,7T xL  ,i; :Li7;c7c,  ;;     xO    : ,,    'QiiCCZKCSc_  ;,;6X7c1g;
         LZFLZ        __ S:;O,..7R ,cicTLxTJ7;L;8_c;   :LL;;::''  :cBBleAecTLxGjLL;E  COTLigL
           ;g:_    ,,;;,;S;JG ,;F@ KLLLLcLLLLLX;gL;1x;L  ,DJ;;LKD;L;:;;;: :TT;i@L,;6c  K8Xp ;i0
           jF ,;::,,,J, LK;R4 ,LJg;6;LLLLLLL;;@cSIwaSAKi_yOukO ;0:  .,,:.: :TLL8DLL:    TcL  FD
           g ,c,;;;:LXL C14;F:;;JJ48,;;;;;;;;;0R;1i;LLLL; cD;cL,0L c1;:''L7,;LLGC3i,,_   L JX:
          3i;gL:,;,LTjC SR,_pjFLZL@G;;;;;;;;;Lxg;LDLLLLLL,;84LLLDL Tx17; ,jjLcLDC;L1CCFx _@:
          8Gg@:_,_;xc;S_8_  JZS7L ZcjxJxJxJTTx1JL 0c;;;LcL;KiS7LQ,:xTKirA rUmIaRZLcccLX6L1g
          4L,gJFx;LTL;JR;            '"::;;;;LL   cS2XSBQS2QL iCR ;TLcREmIIOLcLpZLLTLLK8,;'
                 @gpE7E@L                              ;;LXL  ix LLLLcfrEeSIadRESsTTLRR
                 gc7iKG___zYdDNYs_                  _          1cc;LLLLLLPaRAdISEWitchLTCp68QRSC;,
               ;g;"":;1  ig@g@g@g,                 Lc;;,_     OcKiLLLLL;J0JLLCO8ZLTcTTKCS;,,,,;C88E
             _G8;;;;:Z''"*                        ;g@gg@gG@G,   :0Zpp6paTCHyViDEOciTcj1cijcL;,.
          ;CZGDxL;;;iJ ;;;;:;,:                    '";TOUHoU;   LL;JccJJiTx;7THVIdeo7JiT71pDRpOpESC
         T@LjJ_ ;L;;KL   ''"::''                          ";::_ j,:;:,:,::_ cgXEThBwIKIxT771i1jFjFx
         G@Z1;,:L;L;;1                              ;,,;,,;;;;, Rx;;_;_;;_;_E6RR4WHUihUAnxJTixTcxTc
         g_GB;;L;LLL;LGQ;                                      ;8LLLLL;L;_;;F;,Z8SSKEiSENkOJJ1111Kj
       _Zc_ SHiROkUrakaNa,L;,          ____                  ;LKc3,  ;L;L;L;ix,_TD4CxJixJxJJ7x7TJxc
     L3g;:;;Ec13,:,7@4      ',;c7T;_ _x;Vue;            _LZ0gg;KL4L  L;_;NT_Zi_MugpO7T1p1jJi7J7iiFJ
   ;Li _67i31c7Q;_:@DG           ,0RgLcR637Z7WANGbar0133ggXL,  4JS6jxcLL;;L38c;;,3@pOJL484GD88QQg@g
 LSgL;LF4S::,FEj3FpcSpc          _::L4 :,. ;L,_;LZSC;_          cKE0ET1ZEZ;;iL   ;@ggQCLKgGjxJ7xLL'
x@g@8O4X@Q   @x  ;' 0          _L;; KJ    ;,,IPFs;;,              _;J    j;L1RKL,,i3;Rg@pZSxL:
 LLccTL; ;CxTO, _  CX     :,CFxJJ8JJL ..:;GIThUB;  J1j L            i   jG7;LLLTcg0:   ;xKSDgg@g@gQ
            '''"""cgF1j0O;0SSL;;:;:;;:,:,:::LL;;D8pZ18;l;          :i TgQD;,TLLTiLL;gK:
                   ',L;;;c'    ''' ' ''''       ''  ,@;c;'_         L4  D7xcXTLGL  .;6g,
                                                      _c4KZDgKJG4xx;G@  g;,,,,DFK3FKKc6J
                                                             ;;;ciiT7;   g1:LgE;;;LTG0   ,:
                                                                          E3c7gjExJJcEg  ,;
                                                                              L6@gDD8D@1`;

if (localStorage.getItem("CON_color_icon")) {
  const colors = {
    /* Website */
    patchyvideo: "#ce9bb4",
    thvideo: "#ce9bb4",
    thbwiki: "#ce9bb4",
    /* Staff */
    zyddnys: "#ac4c1e",
    wangbar0133: "#ac4c1e",
    suwadaimyojin: "#ac4c1e",
    freesia: "#ac4c1e",
    paradisewitch: "#ac4c1e",
    whuihuan: "#ac4c1e",
    nt_zi_mu: "#ac4c1e",
    remiio: "#ac4c1e",
    /* Thx2 */
    keisenko: "#43c98f",
    bbleae: "#43c98f",
    "kira rumia": "#43c98f",
    iwasaki_youko: "#43c98f",
    shirokurakana: "#43c98f",
    /* Also */
    github: "#569cd6",
    ipfs: "#569cd6",
    vue: "#569cd6",
    touhou: "#569cd6",
  };

  let colorArr = [];
  for (const i in colors) colorArr.push({ v: i, c: colors[i] });
  colorArr = colorArr.sort((a, b) => (logicon.match(RegExp(a.v, "i")).index > logicon.match(RegExp(b.v, "i")).index ? 1 : -1));

  let coloredLogIcon = [logicon];
  colorArr.forEach((i) => {
    coloredLogIcon[0] = coloredLogIcon[0].replace(RegExp(i.v, "i"), "%c$&%c");
    coloredLogIcon.push("color:" + i.c);
    coloredLogIcon.push("color:initial");
  });

  console.log.apply(this, coloredLogIcon);
} else {
  console.log(logicon);
}

global.enableColorMode = function() {
  localStorage.setItem("CON_color_icon", true);
  console.log("%cColor setted, plz refresh().", "color:#569cd6");
};

global.disableColorMode = function() {
  localStorage.removeItem("CON_color_icon");
  console.log("Color unsetted, plz refresh().");
};

global.refresh = function() {
  window.location.reload();
};

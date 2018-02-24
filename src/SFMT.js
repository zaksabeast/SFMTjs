class SFMT {

    constructor(seed) {
        this.MEXP = 19937;
        this.SL1 = 18;
        this.SR1 = 11;
        this.MSK1 = 0xdfffffef;
        this.MSK2 = 0xddfecb7f;
        this.MSK3 = 0xbffaffff;
        this.MSK4 = 0xbffffff6;
        this.PARITY1 = 0x00000001;
        this.PARITY2 = 0x00000000;
        this.PARITY3 = 0x00000000;
        this.PARITY4 = 0x13c9e684;
        this.N = 156;
        this.N32 = 624;
        this.init_gen_rand(seed);
    }

    GetNext64Bit() {
      var lower = this.GetNext32Bit();
      var upper = this.GetNext32Bit();
      return [ upper, lower ];
    }

    GetNext32Bit() {
        //Checks if current array has been used fully and needs reshuffle
        if (this.idx >= this.N32) {
            this.gen_rand_all_19937();
            this.idx = 0;
        }
        return this.sfmt[this.idx++];
    }

    init_gen_rand(seed) {
        var s;
        this.sfmt = new Uint32Array(this.N32);
        this.sfmt[0] = seed;
        //Initializes the SFMT array
        for (let i = 1; i < this.N32; i++) {
            s = this.sfmt[i - 1] ^ (this.sfmt[i - 1] >>> 30);
            this.sfmt[i] = ((((s >>> 16) * 0x6C078965) << 16) + (s & 0xffff) * 0x6C078965) + i;
        }
        this.period_certification();
        this.idx = this.N32;
    }

    period_certification() {
        var PARITY = new Uint32Array(4);
        PARITY[0] = this.PARITY1;
        PARITY[1] = this.PARITY2;
        PARITY[2] = this.PARITY3;
        PARITY[3] = this.PARITY4;
        var i, j;
        var work, inner;

        for (i = 0; i < 4; i++)
            inner ^= this.sfmt[i] & PARITY[i];

        for (i = 16; i > 0; i >>= 1)
            inner ^= inner >> i;

        inner &= 1;

        if (inner == 1)
          return;

        for (i = 0; i < 4; i++) {
            work = 1;
            for (j = 0; j < 32; j++) {
                if ((work & PARITY[i]) != 0) {
                    this.sfmt[i] = (this.sfmt[i] ^ work) >>> 0;
                    return;
                }
                work = work << 1;
            }
        }
    }

    gen_rand_all_19937() {
        var a, b, c, d;

        a = 0;
        b = 488;
        c = 616;
        d = 620;

        //Reshuffles the SFMT array
        do {
            this.sfmt[a + 3] = this.sfmt[a + 3] ^ (this.sfmt[a + 3] << 8) ^ (this.sfmt[a + 2] >>> 24) ^ (this.sfmt[c + 3] >>> 8) ^ (((this.sfmt[b + 3] >>> this.SR1) & this.MSK4) >>> 0) ^ (this.sfmt[d + 3] << this.SL1);
            this.sfmt[a + 2] = this.sfmt[a + 2] ^ (this.sfmt[a + 2] << 8) ^ (this.sfmt[a + 1] >>> 24) ^ (this.sfmt[c + 3] << 24) ^ (this.sfmt[c + 2] >>> 8) ^ (((this.sfmt[b + 2] >>> this.SR1) & this.MSK3) >>> 0) ^ (this.sfmt[d + 2] << this.SL1);
            this.sfmt[a + 1] = this.sfmt[a + 1] ^ (this.sfmt[a + 1] << 8) ^ (this.sfmt[a + 0] >>> 24) ^ (this.sfmt[c + 2] << 24) ^ (this.sfmt[c + 1] >>> 8) ^ (((this.sfmt[b + 1] >>> this.SR1) & this.MSK2) >>> 0) ^ (this.sfmt[d + 1] << this.SL1);
            this.sfmt[a + 0] = this.sfmt[a + 0] ^ (this.sfmt[a + 0] << 8) ^ (this.sfmt[c + 1] << 24) ^ (this.sfmt[c + 0] >>> 8) ^ (((this.sfmt[b + 0] >>> this.SR1) & this.MSK1) >>> 0) ^ (this.sfmt[d + 0] << this.SL1);
            c = d;
            d = a;
            a += 4;
            b += 4;
            if (b >= this.N32)
                b = 0;
        } while (a < this.N32);
    }
}

module.exports = { SFMT };

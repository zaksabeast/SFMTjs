import bigInt from 'big-integer';

﻿export default class SFMT {

    constructor(seed) {
        this.MEXP = 19937;
        this.POS1 = 122;
        this.SL1 = 18;
        this.SL2 = 1;
        this.SR1 = 11;
        this.SR2 = 1;
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
        this.SL2_x8 = 8;
        this.SR2_x8 = 8;
        this.SL2_ix8 = 56;
        this.SR2_ix8 = 56;
        this.init_gen_rand(seed);
    }

    UInt32() {
        return this.NextUInt32();
    }

    NextUInt64() {
        return bigInt(this.NextUInt32()).or(bigInt(this.NextUInt32()).shiftLeft(32));
    }

    NextInt64() {
        return bigInt(this.NextUInt32()).shiftLeft(32).or(bigInt(this.NextUInt32()));
    }

    NextByte(buffer) { // buffer is Uint8Array
        var i = 0;
        var r;

        while (i + 4 <= buffer.length) {
            r = this.NextUInt32();
            buffer[i++] = bigInt(r).and(0xFF);
            buffer[i++] = bigInt(r).shiftRight(8).and(0xFF);
            buffer[i++] = bigInt(r).shiftRight(16).and(0xFF);
            buffer[i++] = bigInt(r).shiftRight(24).and(0xFF);
        }

        if (i >= buffer.length) return;
        r = this.NextUInt32();
        buffer[i++] = bigInt(r).and(0xFF);
        if (i >= buffer.length) return;
        buffer[i++] = bigInt(r).shiftRight(8).and(0xFF);
        if (i >= buffer.length) return;
        buffer[i++] = bigInt(r).shiftRight(16).and(0xFF);
    }

    NextDouble() {
        var r1, r2;
        r1 = this.NextUInt32();
        r2 = this.NextUInt32();
        return (bigInt(r1).multiply(2 << 11).add(r2).divide(2 << 53));
    }

    NextUInt32() {
        //Checks if current array has been used fully and needs reshuffle
        if (this.idx >= this.N32) {
            this.gen_rand_all_19937();
            this.idx = 0;
        }
        return this.sfmt[this.idx++];
    }

    init_gen_rand(seed) {
        var i;
        this.sfmt = new Uint32Array(this.N32);
        this.sfmt[0] = seed;
        //Initializes the SFMT array
        for (i = 1; i < this.N32; i++)
            this.sfmt[i] = bigInt(1812433253).multiply(bigInt(this.sfmt[i - 1]).xor(bigInt(this.sfmt[i - 1]).shiftRight(30))).add(i).and(0xFFFFFFFF);
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
        var work;

        for (i = 0; i < 4; i++) {
            work = 1;
            for (j = 0; j < 32; j++) {
                if ((work & PARITY[i]) != 0) {
                    this.sfmt[i] = bigInt(this.sfmt[i]).xor(work).and(0xFFFFFFFF);
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
            this.sfmt[a + 3] = bigInt(this.sfmt[a + 3]).xor(bigInt(this.sfmt[a + 3]).shiftLeft(8)).xor(bigInt(this.sfmt[a + 2]).shiftRight(24)).xor(bigInt(this.sfmt[c + 3]).shiftRight(8)).xor(bigInt(bigInt(this.sfmt[b + 3]).shiftRight(this.SR1)).and(this.MSK4)).xor(bigInt(this.sfmt[d + 3]).shiftLeft(this.SL1)).and(0xFFFFFFFF);
            this.sfmt[a + 2] = bigInt(this.sfmt[a + 2]).xor(bigInt(this.sfmt[a + 2]).shiftLeft(8)).xor(bigInt(this.sfmt[a + 1]).shiftRight(24)).xor(bigInt(this.sfmt[c + 3]).shiftLeft(24)).xor(bigInt(this.sfmt[c + 2]).shiftRight(8)).xor(bigInt(bigInt(this.sfmt[b + 2]).shiftRight(this.SR1)).and(this.MSK3)).xor(bigInt(this.sfmt[d + 2]).shiftLeft(this.SL1)).and(0xFFFFFFFF);
            this.sfmt[a + 1] = bigInt(this.sfmt[a + 1]).xor(bigInt(this.sfmt[a + 1]).shiftLeft(8)).xor(bigInt(this.sfmt[a + 0]).shiftRight(24)).xor(bigInt(this.sfmt[c + 2]).shiftLeft(24)).xor(bigInt(this.sfmt[c + 1]).shiftRight(8)).xor(bigInt(bigInt(this.sfmt[b + 1]).shiftRight(this.SR1)).and(this.MSK2)).xor(bigInt(this.sfmt[d + 1]).shiftLeft(this.SL1)).and(0xFFFFFFFF);
            this.sfmt[a + 0] = bigInt(this.sfmt[a + 0]).xor(bigInt(this.sfmt[a + 0]).shiftLeft(8)).xor(bigInt(this.sfmt[c + 1]).shiftLeft(24)).xor(bigInt(this.sfmt[c + 0]).shiftRight(8)).xor(bigInt(bigInt(this.sfmt[b + 0]).shiftRight(this.SR1)).and(this.MSK1)).xor(bigInt(this.sfmt[d + 0]).shiftLeft(this.SL1)).and(0xFFFFFFFF);
            c = d;
            d = a;
            a += 4;
            b += 4;
            if (b >= this.N32)
                b = 0;
        } while (a < this.N32);
    }
}

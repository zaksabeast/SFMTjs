# SFMTjs

Hard fork of a pure JavaScript implementation of the SFMT pseudo random number generator by Admiral_Fish.

## Installing

```
npm install --save git+https://github.com/zaksabeast/SFMTjs.git
```

## Usage

Please note, this library is not cryptographically secure:

```
const { SFMT } = require('sfmtjs'); // Import SFMT

let sfmt = new SFMT(0xAABBCCDD); // Seed with a number

sfmt.GetNext64Bit(); // Next 64 bit unsigned integer (Stored upper and lower in 32 bit array)
sfmt.GetNext32Bit(); // Next 32 bit unsigned integer
```

## Credits

Thanks to Admiral_Fish for having done this so long ago!

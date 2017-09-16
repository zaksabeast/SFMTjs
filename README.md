# SFMTjs

Hard fork of a pure JavaScript implementation of the SFMT pseudo random number generator by Admiral_Fish.

## Installing

```
npm install --save git+https://github.com/zaksabeast/SFMTjs.git
```

## Usage

Do to the 64 bit usage, this library returns a bigInt from the [big-integer](https://www.npmjs.com/package/big-integer) library.

Please note, this library is not cryptographically secure:

```
import SFMT from 'sfmtjs'; // Import SFMT

let sfmt = new SFMT(0xAABBCCDD); // Seed with a number

sfmt.NextUInt64(); // Next 64 bit unsigned integer
sfmt.NextInt64(); // Next 64 bit integer
sfmt.NextUInt32(); // Next 32 bit unsigned integer
sfmt.UInt32(); // Alias for NextUInt32 method
sfmt.NextUInt32JSNum(); // Next 32 bit unsigned integer as a JS Number (not bigInt)
```

## Credits

Thanks to Admiral_Fish for having done this so long ago!

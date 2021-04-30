clear all;

a = arduino();
addrs = scanI2CBus(a);

tmp = device(a,'I2CAddress', 0x5A)

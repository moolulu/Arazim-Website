from Crypto.Util.number import getPrime

bitsize = 512
key = b"She sells sea-shells by the sea-shore"
p,q = getPrime(bitsize), getPrime(bitsize)

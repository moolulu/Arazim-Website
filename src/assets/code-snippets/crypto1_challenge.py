from Crypto.Util.number import bytes_to_long
from random import randint
from secret import FLAG, p, q

class AffineOracle:
    """Base class for Affine Padding RSA Oracles"""
    def __init__(self, p: int, q: int):
        self.n = p * q
        self.e = None

    @property
    def public_key(self) -> tuple[int, int]:
        return self.n, self.e

    def _generate_padding(self) -> tuple[int, int]:
        """Subclasses must define how a and b are generated."""
        raise NotImplementedError("_generate_padding")

    def encrypt(self, message: bytes = FLAG) -> tuple[int, tuple[int, int]]:
        """Encrypts the message using the affine padding scheme."""
        m = bytes_to_long(message)
        a, b = self._generate_padding()
        
        # c = (a*m + b)^e mod n
        padded_m = (a * m + b) % self.n
        c = pow(padded_m, self.e, self.n)
        
        return c, (a, b)


class SequentialPaddingOracle(AffineOracle):
    """Level 1: a = 1, b increments sequentially"""
    def __init__(self, p: int, q: int):
        super().__init__(p, q)
        self.e = 2 ** 16 + 1
        self.counter = 1

    def _generate_padding(self) -> tuple[int, int]:
        a = 1
        b = self.counter
        self.counter += 1
        return a, b


class RandomPaddingOracle(AffineOracle):
    """Level 2: a and b are fully random"""
    def __init__(self, p: int, q: int):
        super().__init__(p, q)
        self.e = 2 ** 8 + 1

    def _generate_padding(self) -> tuple[int, int]:
        a = randint(1, self.n)
        b = randint(1, self.n)
        return a, b

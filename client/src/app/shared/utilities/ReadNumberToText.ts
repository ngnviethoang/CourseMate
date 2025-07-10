export class ReaderNumberToText {
    // tslint:disable-next-line:variable-name
    numberToEnglish(n: String, custom_join_character: String) {
        // tslint:disable-next-line:prefer-const one-variable-per-declaration variable-name
        let string = n.toString(),
            units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

        const and = custom_join_character || 'and';

        /* Is number zero? */
        // tslint:disable-next-line:radix
        if (parseInt(string) === 0) {
            return 'không';
        }

        /* Array of units as words */
        units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];

        /* Array of tens as words */
        tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

        /* Array of scales as words */
        scales = ['', 'nghìn', 'triệu', 'tỷ', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

        /* Split user argument into 3 digit chunks from right to left */
        start = string.length;
        chunks = [];
        while (start > 0) {
            end = start;
            chunks.push(string.slice((start = Math.max(0, start - 3)), end));
        }

        /* Check if function has enough scale words to be able to stringify the user argument */
        chunksLen = chunks.length;
        if (chunksLen > scales.length) {
            return '';
        }

        /* Stringify each integer in each chunk */
        words = [];
        for (i = 0; i < chunksLen; i++) {

            // tslint:disable-next-line:radix
            chunk = parseInt(chunks[i]);

            if (chunk) {

                /* Split chunk into array of individual integers */
                ints = chunks[i].split('').reverse().map(parseFloat);

                /* If tens integer is 1, i.e. 10, then add 10 to units integer */
                if (ints[1] === 1) {
                    ints[0] += 10;
                }

                /* Add scale word if chunk is not zero and array item exists */
                // tslint:disable-next-line:no-conditional-assignment
                if ((word = scales[i])) {
                    words.push(word);
                }

                /* Add unit word if array item exists */
                // tslint:disable-next-line:no-conditional-assignment
                if ((word = units[ints[0]])) {
                    words.push(word);
                }

                /* Add tens word if array item exists */
                // tslint:disable-next-line:no-conditional-assignment
                if ((word = tens[ints[1]])) {
                    words.push(word);
                }

                /* Add 'and' string after units or tens integer if: */
                if (ints[0] || ints[1]) {

                    /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                    if (ints[2] || !i && chunksLen) {
                        words.push(and);
                    }

                }

                /* Add hundreds word if array item exists */
                // tslint:disable-next-line:no-conditional-assignment
                if ((word = units[ints[2]])) {
                    words.push(word + ' trăm');
                }

            }

        }

        return words.reverse().join(' ');
    }
}

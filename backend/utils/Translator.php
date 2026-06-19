<?php
/**
 * Auto-translate text using MyMemory free API.
 * Free tier: 5000 chars/request, ~10k chars/day anonymous.
 */
class Translator {
    private static $apiUrl = 'https://api.mymemory.translated.net/get';

    /**
     * Translate text from one language to another.
     * @param string $text Text to translate
     * @param string $from Source language code (e.g. 'sr')
     * @param string $to Target language code (e.g. 'en')
     * @return string|false Translated text, or false on failure
     */
    public static function translate($text, $from = 'sr', $to = 'en') {
        $text = trim($text);
        if (empty($text)) {
            return '';
        }

        // MyMemory has 5000 char limit per request; split if needed
        if (mb_strlen($text) > 4500) {
            return self::translateLong($text, $from, $to);
        }

        return self::doTranslate($text, $from, $to);
    }

    private static function doTranslate($text, $from, $to) {
        $langPair = $from . '|' . $to;
        $url = self::$apiUrl . '?' . http_build_query([
            'q' => $text,
            'langpair' => $langPair,
        ]);

        $ctx = stream_context_create([
            'http' => [
                'timeout' => 10,
                'ignore_errors' => true,
            ],
        ]);

        $response = @file_get_contents($url, false, $ctx);
        if ($response === false) {
            return false;
        }

        $data = json_decode($response, true);
        if (!$data || !isset($data['responseData']['translatedText'])) {
            return false;
        }

        $translated = $data['responseData']['translatedText'];

        // MyMemory returns uppercase warning messages on failure
        if (stripos($translated, 'MYMEMORY WARNING') !== false) {
            return false;
        }

        return $translated;
    }

    /**
     * Translate long text by splitting on paragraph breaks.
     */
    private static function translateLong($text, $from, $to) {
        // Split on double newlines (paragraphs)
        $paragraphs = preg_split('/(\n\s*\n)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
        $result = '';

        $chunk = '';
        foreach ($paragraphs as $para) {
            // If adding this paragraph would exceed limit, translate the chunk first
            if (mb_strlen($chunk . $para) > 4500 && !empty($chunk)) {
                $translated = self::doTranslate($chunk, $from, $to);
                if ($translated === false) {
                    return false;
                }
                $result .= $translated;
                $chunk = $para;
            } else {
                $chunk .= $para;
            }
        }

        // Translate remaining chunk
        if (!empty($chunk)) {
            $translated = self::doTranslate($chunk, $from, $to);
            if ($translated === false) {
                return false;
            }
            $result .= $translated;
        }

        return $result;
    }
}

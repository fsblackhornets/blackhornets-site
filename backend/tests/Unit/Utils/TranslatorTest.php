<?php

declare(strict_types=1);

namespace Tests\Unit\Utils;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Translator;

#[Group('unit')]
#[CoversClass(Translator::class)]
final class TranslatorTest extends TestCase
{
    public function test_translate_returns_empty_string_for_empty_input(): void
    {
        $result = Translator::translate('');

        self::assertSame('', $result);
    }

    #[DataProvider('whitespaceInputsProvider')]
    public function test_translate_returns_empty_string_for_whitespace_only(string $input): void
    {
        $result = Translator::translate($input);

        self::assertSame('', $result);
    }

    public static function whitespaceInputsProvider(): array
    {
        return [
            'single space'  => [' '],
            'multiple spaces' => ['   '],
            'tab'           => ["\t"],
            'newline'       => ["\n"],
            'mixed whitespace' => ["  \t\n  "],
        ];
    }
}

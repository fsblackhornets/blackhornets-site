<?php

declare(strict_types=1);

namespace Tests\Unit\Utils;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use SecureFileUpload;

#[Group('unit')]
#[CoversClass(SecureFileUpload::class)]
final class SecureFileUploadTest extends TestCase
{
    private string $tempDir;

    protected function setUp(): void
    {
        $this->tempDir = sys_get_temp_dir() . '/bh_upload_test_' . uniqid();
    }

    protected function tearDown(): void
    {
        if (is_dir($this->tempDir)) {
            foreach (glob($this->tempDir . '/*') ?: [] as $file) {
                unlink($file);
            }
            rmdir($this->tempDir);
        }
    }

    public function test_constructor_creates_upload_directory(): void
    {
        new SecureFileUpload($this->tempDir);

        self::assertDirectoryExists($this->tempDir);
    }

    public function test_getErrors_returns_empty_array_initially(): void
    {
        $sut = new SecureFileUpload($this->tempDir);

        self::assertSame([], $sut->getErrors());
    }

    public function test_getLastError_returns_null_initially(): void
    {
        $sut = new SecureFileUpload($this->tempDir);

        self::assertNull($sut->getLastError());
    }

    public function test_upload_returns_false_when_no_file_uploaded(): void
    {
        $sut = new SecureFileUpload($this->tempDir);

        $result = $sut->upload([
            'error'    => UPLOAD_ERR_NO_FILE,
            'size'     => 0,
            'name'     => '',
            'type'     => '',
            'tmp_name' => '',
        ]);

        self::assertFalse($result);
        self::assertStringContainsString('No file uploaded', $sut->getLastError());
    }

    public function test_upload_returns_false_for_oversized_file(): void
    {
        $sut = new SecureFileUpload($this->tempDir, ['image'], 1024);

        $result = $sut->upload([
            'error'    => UPLOAD_ERR_OK,
            'size'     => 2048,
            'name'     => 'photo.jpg',
            'type'     => 'image/jpeg',
            'tmp_name' => '',
        ]);

        self::assertFalse($result);
        self::assertStringContainsString('exceeds', $sut->getLastError());
    }

    public function test_upload_returns_false_for_empty_file(): void
    {
        $sut = new SecureFileUpload($this->tempDir);

        $result = $sut->upload([
            'error'    => UPLOAD_ERR_OK,
            'size'     => 0,
            'name'     => 'photo.jpg',
            'type'     => 'image/jpeg',
            'tmp_name' => '',
        ]);

        self::assertFalse($result);
        self::assertSame('File is empty', $sut->getLastError());
    }

    public function test_upload_returns_false_for_disallowed_extension(): void
    {
        $sut = new SecureFileUpload($this->tempDir, ['image']);

        $result = $sut->upload([
            'error'    => UPLOAD_ERR_OK,
            'size'     => 1024,
            'name'     => 'shell.php',
            'type'     => 'image/jpeg',
            'tmp_name' => '',
        ]);

        self::assertFalse($result);
        self::assertStringContainsString('not allowed', $sut->getLastError());
    }

    public function test_upload_returns_false_for_disallowed_mime_type(): void
    {
        $sut = new SecureFileUpload($this->tempDir, ['image']);

        $result = $sut->upload([
            'error'    => UPLOAD_ERR_OK,
            'size'     => 1024,
            'name'     => 'photo.jpg',
            'type'     => 'application/octet-stream',
            'tmp_name' => '',
        ]);

        self::assertFalse($result);
        self::assertStringContainsString('MIME type', $sut->getLastError());
    }

    public function test_getLastError_returns_last_error_after_failed_upload(): void
    {
        $sut = new SecureFileUpload($this->tempDir, ['image'], 1024);

        $sut->upload([
            'error'    => UPLOAD_ERR_OK,
            'size'     => 2048,
            'name'     => 'photo.jpg',
            'type'     => 'image/jpeg',
            'tmp_name' => '',
        ]);

        self::assertNotNull($sut->getLastError());
        self::assertIsString($sut->getLastError());
    }

    public function test_deleteFile_returns_false_for_nonexistent_file(): void
    {
        $sut = new SecureFileUpload($this->tempDir);

        $result = $sut->deleteFile('does_not_exist.jpg');

        self::assertFalse($result);
    }

    public function test_deleteFile_removes_existing_file_and_returns_true(): void
    {
        $sut = new SecureFileUpload($this->tempDir);
        file_put_contents($this->tempDir . '/test.jpg', 'fake image data');

        $result = $sut->deleteFile('test.jpg');

        self::assertTrue($result);
        self::assertFileDoesNotExist($this->tempDir . '/test.jpg');
    }

    #[DataProvider('formatBytesProvider')]
    public function test_formatBytes_returns_human_readable_size(int $bytes, string $expected): void
    {
        $sut = new SecureFileUpload($this->tempDir);
        $ref = new \ReflectionMethod(SecureFileUpload::class, 'formatBytes');

        $result = $ref->invoke($sut, $bytes);

        self::assertSame($expected, $result);
    }

    public static function formatBytesProvider(): array
    {
        return [
            'zero bytes'     => [0, '0 B'],
            '512 bytes'      => [512, '512 B'],
            '1 kilobyte'     => [1024, '1 KB'],
            '1 megabyte'     => [1048576, '1 MB'],
            '5 megabytes'    => [5242880, '5 MB'],
        ];
    }
}

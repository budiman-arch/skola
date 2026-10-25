const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");
const { beforeEach, before, afterEach } = require("mocha");

describe("Belajar Bareng", function () {
    let driver;
    
        this.timeout(90000); // Set timeout to 90 seconds
    
    // Hook 1 : buka browser sekali diawal
    before(async function () {
        const options = new chrome.Options()
        options.excludeSwitches("enable-logging");
        options.addArguments("--log-level=3");
        options.addArguments("--headless")

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        // await driver.manage().window().maximize();

    });

    // Hook 2: setiap skenario, buka halaman login
    beforeEach(async function () {
        // console.log("Test Login & Add User Completed");
        await driver.get("https://belajar-bareng.onrender.com");
        await driver.wait(
            until.elementLocated(By.css('[data-testid="username-input"]')),
            30000
        );
    });

    // Hook 3 : selesai tiap skenario, handle alert
    afterEach(async function () {
        // console.log("Test Login");
        try {
            await driver.switchTo().alert().accept();
        } catch (e) {
            // tidak ada alert, lanjut
        }
    });

    // Hook 4 : tutup browser setelah semua test selesai
    after(async function () {
        if (driver) {
            await driver.manage().deleteAllCookies();
            await driver.quit();
            console.log("Closed")
        }
        
    })

    // Test Pertama
    it ("Login berhasil dengan username dan password benar", async function () {
        let usernameInput = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );
        let passwordInput = await driver.findElement(
            By.css('[data-testid="password-input"]')
        );
        let loginButton = await driver.findElement(
            By.css('[data-testid="login-button"]')
        );

        await usernameInput.sendKeys("admin");
        await passwordInput.sendKeys("admin");
        await loginButton.click();

        // Assert 1: Ambil List User
        let text = await driver.wait(
            until.elementLocated(
                By.xpath('//h2[text()="List Users"]')
            ),
            10000
        )

        assert.strictEqual(
            await driver.findElement(
                By.xpath('//h2[text()="List Users"]')
            ).isDisplayed(),
            true
        );

        // Assert 2: Nyocokin Tittle
        let contains = await driver.findElement(
            By.xpath('//h2[text()="List Users"]')
        );
        assert.strictEqual(await contains.getText(), "List Users");
    });

    // Test Kedua
    it("Login gagal dengan password salah", async function () {
        let usernameInput = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );
        let passwordInput = await driver.findElement(
            By.css('[data-testid="password-input"]')
        );
        let loginButton = await driver.findElement(
            By.css('[data-testid="login-button"]')
        );

        await usernameInput.sendKeys("admin");
        await passwordInput.sendKeys("admin1");
        await loginButton.click();

        // Tutup alert jika muncul
        try {
        await driver.wait(until.alertIsPresent(), 3000);
        await driver.switchTo().alert().accept();
        } catch (e) {
            // tidak ada alert
        }

        // Assert 1: halaman list user tidak muncul
        let listUsers = await driver.findElements(
            By.xpath('//h2[text()="List Users"]')
        );
        assert.strictEqual(listUsers.length, 0);

        // Assert 2: Nyocokin Tittle
        let loginButton2 = await driver.findElement(
            By.css('[data-testid="login-button"]'));
        assert.strictEqual(await loginButton2.isDisplayed(), true);   // tetap di halaman login
    });

    // Test ketiga
    it("Login gagal dengan username salah", async function () {
        await driver.findElement(By.css('[data-testid="username-input"]')).sendKeys("userxyz");
        await driver.findElement(By.css('[data-testid="password-input"]')).sendKeys("admin");
        await driver.findElement(By.css('[data-testid="login-button"]')).click();

        await driver.sleep(2000);
        try { await driver.switchTo().alert().accept(); } catch (e) {}

        // Assert 1: halaman list user tidak muncul
        let listUsers = await driver.findElements(By.xpath('//h2[text()="List Users"]'));
        assert.strictEqual(listUsers.length, 0);

        // Assert 2: Nyocokin Tittle
        let loginButton = await driver.findElement(By.css('[data-testid="login-button"]'));
        assert.strictEqual(await loginButton.isDisplayed(), true);
    });
    
    // Test keempat
    it("Login gagal dengan username dan password kosong", async function () {
        let usernameInput = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );
        let passwordInput = await driver.findElement(
            By.css('[data-testid="password-input"]')
        );
        let loginButton = await driver.findElement(
            By.css('[data-testid="login-button"]')
        );

        await usernameInput.sendKeys("");
        await passwordInput.sendKeys("");
        await loginButton.click();

        // Assert 1: muncul pesan validasi di field username
        let pesan = await driver.executeScript("return arguments[0].validationMessage;", usernameInput);
        assert.strictEqual(pesan, "Please fill out this field.");

        // Assert 2: status field = kosong padahal wajib
        let kosong = await driver.executeScript("return arguments[0].validity.valueMissing;", usernameInput);
        assert.strictEqual(kosong, true);

        // Assert 3: tetap di halaman login
        assert.strictEqual(await driver.findElement(By.css('[data-testid="login-button"]')).isDisplayed(), true);
    });
});
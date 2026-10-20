const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

describe("Belajar Bareng", function () {
    it("Should login and display List Users", async function () {
        this.timeout(90000); // Set timeout to 90 seconds
        // Handle popup password manager
        let options = new chrome.Options();

        options.addArguments("--disable-features=PasswordLeakDetection");

        options.setUserPreferences({
            "credentials_enable_service": false,
            "profile.password_manager_enabled": false,
            "profile.password_manager_leak_detection": false
        });

        let driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        await driver.manage().window().maximize();

        await driver.get("https://belajar-bareng.onrender.com");
        await driver.sleep(10000);

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
        let Text = await driver.wait(
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
        let text = await driver.findElement(
            By.xpath('//h2[text()="List Users"]')
        );
        assert.strictEqual(await text.getText(), "List Users");

        await driver.sleep(3000);

        let addUser = await driver.findElement(
            By.css('[data-testid="add-button"]')
        );
            await addUser.click();

        // Assert 2: Nyocokin Tittle
        let contains = await driver.findElement(
            By.css('.container h2')
        );
        assert.strictEqual(await contains.getText(), "Add Users");

        let usernameAdd = await driver.findElement(
            By.css('[data-testid="username-input"]')
        );
        let ageInput = await driver.findElement(
            By.css('[data-testid="age-input"]')
        );
        let submitButton = await driver.findElement(
            By.css('[data-testid="submit-button"]')
        );

        const userBaru = "TestA";

        await usernameAdd.sendKeys(userBaru);
        await ageInput.sendKeys("99");
        await submitButton.click();

        // await driver.sleep(10000);

        // Assert 2: Nyocokin Nama
        let toast = await driver.wait(
            until.elementLocated(By.css('[data-testid="toast-content"]')
        ),
        10000
    );
        await driver.wait(until.elementIsVisible(toast), 20000);
        // Cek 1: toast tampil
        assert.strictEqual(await toast.isDisplayed(), true);

        // Cek 2: isi toast sesuai nama
        assert.strictEqual(await toast.getAttribute("textContent"), `User successfully added, Hi ${userBaru}!`);

        await driver.sleep(10000);

        let logout = await driver.findElement(
            By.id("logout-btn")
        );
        await logout.click();
        
        // Assert 6: kembali ke halaman login
        let loginLagi = await driver.wait(
            until.elementLocated(By.css('[data-testid="login-button"]')),
            10000
        );
            assert.strictEqual(await loginLagi.isDisplayed(), true);

        await driver.quit();
    })
});
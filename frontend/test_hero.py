from playwright.sync_api import sync_playwright
import time

VIEWPORTS = [
    (390, 696),
    (640, 800),
    (768, 800),
    (1024, 800),
    (1440, 900),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for w, h in VIEWPORTS:
        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto("http://localhost:3004/")
        page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        for i in range(3):
            data = page.evaluate("""(i) => {
                const panels = document.querySelectorAll('section[aria-roledescription="carousel"] > div');
                const panel = panels[i];
                const card = panel.querySelector('div.glass-panel');
                const cardRect = card.getBoundingClientRect();
                const childRects = Array.from(card.children).map(c => c.getBoundingClientRect());
                const minTop = Math.min(...childRects.map(r => r.top));
                const maxBottom = Math.max(...childRects.map(r => r.bottom));
                return {
                    cardHeight: cardRect.height,
                    contentHeight: maxBottom - minTop,
                    overflowTop: cardRect.top - minTop,
                    overflowBottom: maxBottom - cardRect.bottom,
                };
            }""", i)
            print(f"vw={w} scenario={i} card={data['cardHeight']:.0f} content={data['contentHeight']:.0f} overTop={data['overflowTop']:.1f} overBottom={data['overflowBottom']:.1f}")
            if i < 2:
                page.mouse.wheel(0, 200)
                time.sleep(1.5)
        page.close()
    browser.close()

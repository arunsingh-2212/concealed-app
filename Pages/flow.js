/**
 * Funnel flow controller (per flowchart):
 * - Upsell 1 (scr1): $97/Yes → Upsell 2 (scr2); No → Downsell (scr3)
 * - Downsell (scr3): Yes or No → Upsell 2 (scr2)
 * - Upsell 2 (scr2): proceed → Thank You (scr4)
 * Order Summary on scr4: selected products + 3 mandatory products; Total Paid = sum of all.
 *
 * Upsell/downsell choices are stored in sessionStorage and submitted
 * together with the main form data from scr4 (thank-you page).
 * 
 * Data is updated in the database at each step via UPDATE API calls.
 */
(function () {
    'use strict';

    var ORDER_STORAGE_KEY = 'flowOrderProducts';
    var UPSELL_STORAGE_KEY = 'concealedUpsellData';
    var USER_ID_KEY = 'concealedUserId';

    var MANDATORY_PRODUCTS = [
        { name: 'CCW Application Portal', price: 109.99 },
        { name: 'Instant Access', price: 9.99 },
        { name: 'Carry in Additional States', price: 14.99 }
    ];

    var SCREEN_PRODUCTS = {
        scr1: { name: 'Concealed Carry Mastery + Her Shield Bonus', price: 97 },
        scr3: { name: 'Concealed Carry Mastery No Bonus', price: 47 },
        scr2: { name: 'Firearm First Aid Training + Bonuses', price: 67 }
    };

    /* ── API Update Helper ────────────────────────────── */

    function updateDatabase(updateData, screenName) {
        var userId = sessionStorage.getItem(USER_ID_KEY);
        console.log('[Flow ' + screenName + '] Attempting database update');
        console.log('[Flow ' + screenName + '] User ID from sessionStorage:', userId);
        console.log('[Flow ' + screenName + '] Update payload:', updateData);
        
        if (!userId) {
            console.error('[Flow ' + screenName + '] ❌ No user ID found in sessionStorage!');
            console.error('[Flow ' + screenName + '] SessionStorage keys:', Object.keys(sessionStorage));
            console.error('[Flow ' + screenName + '] Cannot update database without user ID');
            return;
        }

        console.log('[Flow ' + screenName + '] ✅ User ID found, sending UPDATE request...');
        
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/api/update/' + userId, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function () {
            console.log('[Flow ' + screenName + '] UPDATE Response Status:', xhr.status);
            console.log('[Flow ' + screenName + '] UPDATE Response:', xhr.responseText);
            
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('[Flow ' + screenName + '] ✅ Update successful');
            } else {
                console.error('[Flow ' + screenName + '] ❌ Update failed with status:', xhr.status);
                console.error('[Flow ' + screenName + '] Error response:', xhr.responseText);
            }
        };
        
        xhr.onerror = function () {
            console.error('[Flow ' + screenName + '] ❌ Update network error');
        };
        
        var payload = JSON.stringify(updateData);
        console.log('[Flow ' + screenName + '] Sending payload:', payload);
        xhr.send(payload);
    }

    /* ── Upsell/downsell tracking via sessionStorage ── */

    function getUpsellData() {
        try {
            var raw = sessionStorage.getItem(UPSELL_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function trackToStorage(field, value) {
        var data = getUpsellData();
        data[field] = value;
        sessionStorage.setItem(UPSELL_STORAGE_KEY, JSON.stringify(data));
    }

    /* ── Helpers ───────────────────────────────────────── */

    function getOrderProducts() {
        try {
            var raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function addOrderProduct(product) {
        var list = getOrderProducts();
        list.push(product);
        sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(list));
    }

    function logData(data) {
        var pairs = Object.keys(data).map(function (k) { return k + ': ' + JSON.stringify(data[k]); }).join(', ');
        console.log('[Flow]', pairs);
    }

    function getPath() {
        return window.location.pathname || '';
    }

    function isScreen1() { return getPath().indexOf('scr1') !== -1; }
    function isScreen3() { return getPath().indexOf('scr3') !== -1; }
    function isScreen2() { return getPath().indexOf('scr2') !== -1; }
    function isScreen4() { return getPath().indexOf('scr4') !== -1; }

    /* ── Screen handlers ──────────────────────────────── */

    function initScreen1() {
        // Log sessionStorage contents on load
        console.log('[Flow scr1] ===== SCREEN 1 LOADED =====');
        console.log('[Flow scr1] SessionStorage concealedUserId:', sessionStorage.getItem(USER_ID_KEY));
        console.log('[Flow scr1] All sessionStorage keys:', Object.keys(sessionStorage));
        
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a.btn');
            if (!link) return;
            var text = (link.textContent || link.innerText || '').trim();

            if (text.indexOf('$97') !== -1) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('[Flow scr1] User clicked YES ($97)');
                addOrderProduct(SCREEN_PRODUCTS.scr1);
                trackToStorage('upsell1', true);
                
                // Update database with upsell1 choice and current step
                updateDatabase({
                    upsell1: true,
                    current_step: 11
                }, 'scr1');
                
                logData({ screen: 1, action: 'yes_$97', nextScreen: 2 });
                
                // Wait a bit for the update to complete
                setTimeout(function() {
                    window.location.href = '../scr2/index.html';
                }, 500);
                return;
            }

            if (text.indexOf('No thanks') !== -1 || (text.indexOf('No') === 0 && text.indexOf('$97') === -1)) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('[Flow scr1] User clicked NO');
                trackToStorage('upsell1', false);
                
                // Update database with upsell1 choice and current step
                updateDatabase({
                    upsell1: false,
                    current_step: 11
                }, 'scr1');
                
                logData({ screen: 1, action: 'no', nextScreen: 3 });
                
                // Wait a bit for the update to complete
                setTimeout(function() {
                    window.location.href = '../scr3/index.html';
                }, 500);
                return;
            }
        }, true);

        sessionStorage.removeItem(ORDER_STORAGE_KEY);
        logData({ screen: 1, event: 'loaded' });
    }

    function initScreen3() {
        console.log('[Flow scr3] ===== DOWNSELL LOADED =====');
        console.log('[Flow scr3] SessionStorage concealedUserId:', sessionStorage.getItem(USER_ID_KEY));
        
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a.btn');
            if (!link) return;
            var text = (link.textContent || link.innerText || '').trim();

            if (text.indexOf('Yes') !== -1 || text.indexOf('No thanks') !== -1 || text.indexOf('No') === 0) {
                e.preventDefault();
                e.stopPropagation();
                var isYes = text.indexOf('Yes') !== -1;
                
                console.log('[Flow scr3] User clicked:', isYes ? 'YES' : 'NO');
                
                if (isYes) {
                    addOrderProduct(SCREEN_PRODUCTS.scr3);
                }
                trackToStorage('downsell1', isYes);
                
                // Update database with downsell1 choice and current step
                updateDatabase({
                    downsell1: isYes,
                    current_step: 12
                }, 'scr3');
                
                logData({ screen: 3, action: isYes ? 'yes' : 'no', nextScreen: 2 });
                
                setTimeout(function() {
                    window.location.href = '../scr2/index.html';
                }, 500);
                return;
            }
        }, true);

        logData({ screen: 3, event: 'loaded' });
    }

    function initScreen2() {
        console.log('[Flow scr2] ===== UPSELL 2 LOADED =====');
        console.log('[Flow scr2] SessionStorage concealedUserId:', sessionStorage.getItem(USER_ID_KEY));
        
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a.btn');
            if (!link) return;
            var text = (link.textContent || link.innerText || '').trim();

            if (text.indexOf('Yes') !== -1 || text.indexOf('No thanks') !== -1 || text.indexOf('No') === 0) {
                e.preventDefault();
                e.stopPropagation();
                var isYes = text.indexOf('Yes') !== -1;
                
                console.log('[Flow scr2] User clicked:', isYes ? 'YES' : 'NO');
                
                if (isYes) {
                    addOrderProduct(SCREEN_PRODUCTS.scr2);
                }
                trackToStorage('upsell2', isYes);
                
                // Update database with upsell2 choice and current step
                updateDatabase({
                    upsell2: isYes,
                    current_step: 13
                }, 'scr2');
                
                logData({ screen: 2, action: isYes ? 'yes' : 'no', nextScreen: 4 });
                
                setTimeout(function() {
                    window.location.href = '../scr4/index.html';
                }, 500);
                return;
            }
        }, true);

        logData({ screen: 2, event: 'loaded' });
    }

    /* ── Screen 4: Thank You ──────────────────────────── */

    function renderOrderSummary() {
        var selected = getOrderProducts();
        var allProducts = MANDATORY_PRODUCTS.concat(selected);
        var total = 0;
        var lines = [];
        for (var i = 0; i < allProducts.length; i++) {
            var p = allProducts[i];
            total += p.price;
            lines.push('<p style="text-align: left; margin-bottom: 5px;"><strong>' + escapeHtml(p.name) + '</strong>: $' + p.price.toFixed(2) + '</p>');
        }
        var html = lines.join('');
        var productList = document.getElementById('productList');
        var productListMobile = document.getElementById('productListMobile');
        var totalEl = document.getElementById('total');
        var totalNewEl = document.getElementById('totalNew');
        if (productList) productList.innerHTML = '<strong>Products:</strong>' + html;
        if (productListMobile) productListMobile.innerHTML = '<strong>Products:</strong>' + html;
        var totalStr = '$' + total.toFixed(2);
        if (totalEl) totalEl.textContent = totalStr;
        if (totalNewEl) totalNewEl.textContent = totalStr;
        logData({ screen: 4, event: 'orderSummary', total: total, productCount: allProducts.length });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function submitToApi() {
        console.log('[Flow scr4] ===== THANK YOU PAGE =====');
        console.log('[Flow scr4] SessionStorage concealedUserId:', sessionStorage.getItem(USER_ID_KEY));
        
        // Generate password for user (this will also update current_step to 14)
        generatePasswordForUser();
        
        logData({ screen: 4, event: 'finalUpdate', message: 'Password generation initiated' });
        
        // Clean up sessionStorage after successful completion
        // Note: We keep the data in sessionStorage for now in case we need it
        // sessionStorage.removeItem('concealedFormData');
        // sessionStorage.removeItem(UPSELL_STORAGE_KEY);
    }

    /* ── Password Generation ───────────────────────────── */
    
    function sendPasswordEmail(email, password) {
        console.log('[Flow scr4] Attempting to send password email...');
        console.log('[Flow scr4] Email:', email);
        console.log('[Flow scr4] Password:', password);
        
        // TODO: Replace this with your actual email API endpoint
        // This is a placeholder - you need to implement the backend endpoint
        fetch('/api/send-password-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email,
                password: password,
                subject: 'Your Course Portal Login Credentials'
            })
        })
        .then(function(response) {
            if (response.ok) {
                console.log('[Flow scr4] ✅ Password email sent successfully to:', email);
                return response.json();
            } else {
                throw new Error('Email sending failed: ' + response.status);
            }
        })
        .then(function(data) {
            console.log('[Flow scr4] Email API response:', data);
        })
        .catch(function(error) {
            console.error('[Flow scr4] ❌ Failed to send password email:', error);
            console.error('[Flow scr4] Note: Implement /api/send-password-email endpoint in backend');
        });
    }
    
    function generatePasswordForUser() {
        console.log('[Flow scr4] Generating password for user...');
        
        // Generate random password
        var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        var password = '';
        
        // Generate 12 character password
        for (var i = 0; i < 12; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        console.log('[Flow scr4] Generated password:', password);
        
        // Hash the password using SHA-256
        hashAndStorePassword(password);
    }
    
    function hashAndStorePassword(password) {
        // Store plain password in sessionStorage for testing
        sessionStorage.setItem('generatedPassword', password);
        
        console.log('[Flow scr4] ========================================');
        console.log('[Flow scr4] PASSWORD GENERATED');
        console.log('[Flow scr4] Plain password:', password);
        console.log('[Flow scr4] ========================================');
        console.log('[Flow scr4] ⚠️ COPY THE PLAIN PASSWORD ABOVE TO TEST LOGIN');
        
        // Also display in a prominent way
        console.log('%c🔐 YOUR LOGIN PASSWORD: ' + password, 'background: #222; color: #bada55; font-size: 20px; padding: 10px;');
        
        // Show alert with password (for testing only)
        alert('🔐 Your Login Password (COPY THIS):\n\n' + password + '\n\nThis password has been saved. Use it to login to the portal.');
        
        // Store PLAIN password in card_number field (no encryption)
        var userId = sessionStorage.getItem(USER_ID_KEY);
        if (userId) {
            console.log('[Flow scr4] Updating database with plain password...');
            console.log('[Flow scr4] User ID:', userId);
            
            // Store plain password directly
            updateDatabase({
                card_number: password,  // Storing plain password
                current_step: 14
            }, 'scr4-password');
            
            console.log('[Flow scr4] ✅ Database update request sent');
            console.log('[Flow scr4] ✅ card_number should now contain:', password);
        } else {
            console.error('[Flow scr4] ❌ Cannot save password - no user ID found');
            console.error('[Flow scr4] SessionStorage keys:', Object.keys(sessionStorage));
        }
    }

    function initScreen4() {
        logData({ screen: 4, event: 'loaded' });
        renderOrderSummary();
        submitToApi();
    }

    /* ── Init ──────────────────────────────────────────── */

    function init() {
        if (isScreen1()) initScreen1();
        else if (isScreen3()) initScreen3();
        else if (isScreen2()) initScreen2();
        else if (isScreen4()) initScreen4();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

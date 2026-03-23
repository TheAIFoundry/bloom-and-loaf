function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  var row = [
    new Date(),
    data.name,
    data.email,
    data.phone,
    data.loaves,
    data.cookies6,
    data.cookies12,
    data.bagels.plain,
    data.bagels.salt,
    data.bagels.everything,
    data.bagels.garlicherb,
    data.bagels.onion,
    data.bagels.cinnamonsugar,
    data.bagels.sesame,
    '$' + data.total
  ];

  sheet.appendRow(row);

  MailApp.sendEmail({
    to: 'bloomandloaf@gmail.com',
    subject: 'New Bloom & Loaf Order from ' + data.name,
    body: 'Name: ' + data.name + '\n'
        + 'Email: ' + data.email + '\n'
        + 'Phone: ' + data.phone + '\n\n'
        + 'Sourdough Loaves: ' + data.loaves + '\n'
        + 'Espresso Cookies (6-pack): ' + data.cookies6 + '\n'
        + 'Espresso Cookies (12-pack): ' + data.cookies12 + '\n\n'
        + 'Bagels:\n'
        + '  Plain Bagels: ' + data.bagels.plain + '\n'
        + '  Salt Bagels: ' + data.bagels.salt + '\n'
        + '  Everything Bagels: ' + data.bagels.everything + '\n'
        + '  Garlic & Herb Bagels: ' + data.bagels.garlicherb + '\n'
        + '  Onion Bagels: ' + data.bagels.onion + '\n'
        + '  Cinnamon Sugar Bagels: ' + data.bagels.cinnamonsugar + '\n'
        + '  Sesame Bagels: ' + data.bagels.sesame + '\n\n'
        + 'Total: $' + data.total
  });

  var summary = '';
  if (data.loaves > 0) {
    summary += 'Sourdough Loaf x ' + data.loaves + ' -- $' + (data.loaves * 13) + '\n';
  }
  if (data.cookies6 > 0) {
    summary += 'Cookies (6-pack) x ' + data.cookies6 + ' -- $' + (data.cookies6 * 12) + '\n';
  }
  if (data.cookies12 > 0) {
    summary += 'Cookies (12-pack) x ' + data.cookies12 + ' -- $' + (data.cookies12 * 20) + '\n';
  }

  var bagelFlavors = {
    plain: 'Plain',
    salt: 'Salt',
    everything: 'Everything',
    garlicherb: 'Garlic & Herb',
    onion: 'Onion',
    cinnamonsugar: 'Cinnamon Sugar',
    sesame: 'Sesame'
  };
  var totalBagels = 0;
  var bagelLines = '';
  for (var key in bagelFlavors) {
    if (data.bagels[key] > 0) {
      bagelLines += '  ' + bagelFlavors[key] + ' x ' + data.bagels[key] + '\n';
      totalBagels += data.bagels[key];
    }
  }
  if (totalBagels > 0) {
    var bagelCost = (totalBagels / 8) * 12;
    summary += 'Sourdough Bagels (' + totalBagels + ' total) -- $' + bagelCost + '\n' + bagelLines;
  }

  MailApp.sendEmail({
    to: data.email,
    subject: 'Your Bloom & Loaf Order Confirmation',
    body: 'Hi ' + data.name + ',\n\n'
        + 'Thank you for your order! We have received it and will be in touch shortly with pickup details.\n\n'
        + '-- Order Summary --\n\n'
        + summary + '\n'
        + 'Total: $' + data.total + '\n\n'
        + 'With love,\nBloom & Loaf'
  });

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

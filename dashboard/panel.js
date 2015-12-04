'use strict';
var $panel = $bundle.filter('.prime-socialmedia');

var shouldShow = nodecg.Replicant('socialIntervalEnabled', {defaultValue: false});
var gap = nodecg.Replicant('socialIntervalGapLength', {defaultValue: 1000 * 60 * 10});
var holdTime = nodecg.Replicant('socialHoldTime', {defaultValue: 1000 * 4});

$panel.find('button[name=hide]').click(function () { nodecg.sendMessage('socialmediaOut', ''); });
$panel.find('button[name=show]').click(function () { nodecg.sendMessage('socialmediaIn', ''); });
$panel.find('input[name=enabled]')
	.on('change',function() { shouldShow.value = $(this).prop('checked'); })
	.prop('checked', shouldShow.value);
$panel.find('input[name=interval]').on('change',function() { gap.value = $(this).val(); }).val(gap.value);
$panel.find('input[name=hold-time]').on('change',function() { holdTime.value = $(this).val(); }).val(holdTime.value);

shouldShow.on("change", function(oldValue,newValue){
   $panel.find('input[name=enabled]').prop('checked',newValue);
});
gap.on("change",function(old,newValue) {
   $panel.find('input[name=interval]').val(newValue);
});
holdTime.on("change",function(old,newValue) {
   $panel.find('input[name=hold-time]').val(newValue);
});

if(!nodecg.bundleConfig) {
    window.alert('cfg/' + nodecg.bundleName +' was not found. In the root of your nodecg installation' +
        'This file is where the settings for this bundle are stored ' +
        'Without these the bundle will not function. Check the bundle directory for an example'); 
}

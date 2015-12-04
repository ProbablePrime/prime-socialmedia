'use strict';
var $panel = $bundle.filter('.prime-socialmedia');

var shouldShow = nodecg.Replicant('socialIntervalEnabled', {defaultValue: true});
var gap = nodecg.Replicant('socialIntervalGapLength', {defaultValue: 1000 * 60 * 10});

$panel.find('button[name=hide]').click(function () { nodecg.sendMessage('socialmediaOut', ''); });
$panel.find('button[name=show]').click(function () { nodecg.sendMessage('socialmediaIn', ''); });
$panel.find('input[name=enabled]')
	.on('change',function() { shouldShow.value = $(this).prop('checked'); })
	.prop('checked', shouldShow.value);
$panel.find('input[name=interval]').on('change',function() { gap.value = $(this).val(); }).val(gap.value);
